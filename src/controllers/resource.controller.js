import { Company } from "../models/company.model.js";
import { Resource } from "../models/resource.model.js";
import { asyncMiddleware } from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const addResource = asyncMiddleware(async (req, res) => {
  // Extract required fields from the request body
  const { learning, companyId, resourceName, resourceLink, endDate } = req.body;
  // Check for the presence of required fields
  if (!learning) {
    throw new ApiError(400, "Learning is required");
  }
  if (!resourceLink) {
    throw new ApiError(400, "Resource Link is required");
  }

  // Create a new Resource instance and save it
  const newResource = new Resource({
    learning,
    companyId,
    resourceName,
    resourceLink,
    endDate,
  });

  // Save the new resource
  const savedResource = await newResource.save();

  // If companyId is provided, associate the resource with the company
  if (companyId != null) {
    // Find the company by companyId
    const company = await Company.findOne({ id: companyId });
    if (!company) {
      throw new ApiError(404, "Company not found.");
    }

    // Add the saved resource to the company's resource array
    company.resource.push(savedResource._id);
    await company.save();
  }

  // Return a success response with the new resource data
  return res
    .status(201)
    .json(new ApiResponse(200, newResource, "Successfully created resource."));
});

// Get All Resources
const getResources = asyncMiddleware(async (req, res) => {
  // Find all resources
  const resources = await Resource.find();

  // Return a success response with the retrieved resources data
  return res
    .status(200)
    .json(new ApiResponse(200, resources, "Resources retrieved successfully"));
});

const updateResource = asyncMiddleware(async (req, res) => {
  // Extract updated data from the request body
  const {
    resourceId,
    learning,
    companyId,
    resourceName,
    resourceLink,
    endDate,
  } = req.body;

  // Check if the resource id is valid
  if (!resourceId || !mongoose.Types.ObjectId.isValid(resourceId)) {
    throw new ApiError(400, "Please provide Correct Resource Id.");
  }

  // Find the existing resource by resource id
  const existingResource = await Resource.findById(resourceId);
  if (!existingResource) {
    throw new ApiError(404, "Resource not found.");
  }

  // If companyId is provided
  if (companyId) {
    // Find the company by companyId
    const company = await Company.findOne({ id: companyId });
    if (!company) {
      throw new ApiError(404, "company not found.");
    }

    // If the provided companyId is different from the existing companyId, update references
    if (String(companyId) !== String(existingResource.companyId)) {
      // Find the existing company by existing companyId
      const existingCompany = await Company.findById(
        existingResource.companyId
      );

      // Remove the resource from the existingCompany
      if (existingCompany) {
        existingCompany.resource = existingCompany.resource.filter(
          (resource) => String(resource) !== String(existingResource._id)
        );
        await existingCompany.save();
      }

      // Add the resource to the new company
      company.resource.push(existingResource._id);
      await company.save();

      existingResource.companyId = company.id;
    }
  }

  // Update fields based on the provided data
  Object.keys(req.body).forEach((key) => {
    if (key !== "resourceId" && key !== "companyId") {
      existingResource[key] = req.body[key];
    }
  });

  // Save the updated resource
  await existingResource.save();

  // Return a success response with the updated resource data
  return res
    .status(200)
    .json(
      new ApiResponse(200, existingResource, "Resource updated successfully")
    );
});

// Delete Resource by resource id
const deleteResource = asyncMiddleware(async (req, res) => {
  // Extract resource id from the request body
  const { resourceId } = req.body;

  // Check if the resource id is valid
  if (!resourceId || !mongoose.Types.ObjectId.isValid(resourceId)) {
    throw new ApiError(400, "Please provide Correct Resource Id.");
  }

  // Find and delete the resource by resource id
  const deletedResource = await Resource.findByIdAndDelete(resourceId);
  if (!deletedResource) {
    throw new ApiError(404, "Resource not found.");
  }

  // Retrieve the company which has posted this resource
  const company = await Company.findById(deletedResource.companyId);
  if (company) {
    // Find the index of the resource to remove
    const indexToRemove = company.resource.findIndex(
      (resource) => String(resource) === String(resourceId)
    );

    // Check if the resource was found
    if (indexToRemove !== -1) {
      // Remove the resource at the found index
      company.resource.splice(indexToRemove, 1);

      await company.save();
    }
  }

  // Return a success response with the deleted resource data
  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedResource, "Resource deleted successfully")
    );
});

// Export the Resource controllers
export { addResource, getResources, updateResource, deleteResource };
