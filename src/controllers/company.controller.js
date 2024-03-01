import { asyncMiddleware } from "../middlewares/asyncHandler.js";
import { Company } from "../models/company.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Resource } from "../models/resource.model.js";
import { Alumni } from "../models/alumni.model.js";

// Create Company
const addCompany = asyncMiddleware(async (req, res) => {
  // Destructure required fields from the request body
  const { id, name, location, visitStatus } = req.body;

  // Define a function to generate a required attribute error message
  const required = (attribute) => `${attribute} is required.`;

  // Check if required fields are provided
  if (!id) {
    throw new ApiError(400, required("id"));
  } else if (!name) {
    throw new ApiError(400, required("name"));
  } else if (!location) {
    throw new ApiError(400, required("location"));
  } else if (!visitStatus) {
    throw new ApiError(400, required("visit status"));
  }

  // Check if the company with the given ID already exists
  const companyExists = await Company.findOne({ id });

  if (companyExists) {
    throw new ApiError(409, "Company already exists.");
  }

  // Create a new company instance with the provided data
  const companyAdded = new Company(req.body);
  // Save the new company to the database
  await companyAdded.save();

  // Check if the company was successfully added
  if (!companyAdded) {
    throw new ApiError("500", "Unable to add company to the database.");
  }

  // Return a success response with the added company data
  return res
    .status(201)
    .json(new ApiResponse(200, companyAdded, "Company Created."));
});

// Get Companies
const getCompanies = asyncMiddleware(async (req, res) => {
  // Retrieve all companies from the database
  const companies = await Company.find();

  // Return a success response with the retrieved companies data
  return res
    .status(200)
    .json(new ApiResponse(200, companies, "Companies retrieved successfully"));
});

// Get Company By Id
const getCompanyById = asyncMiddleware(async (req, res) => {
  // Extract the company ID from the request query parameters
  const id = req.query.id;

  // Check if a valid company ID is provided
  if (!id) {
    throw new ApiError(400, "Please Provide Company Id.");
  }

  // Find a company by the provided ID
  const company = await Company.findOne({ id });
  // Check if the company is not found
  if (!company) {
    throw new ApiError(400, "Company not found.");
  }

  // Return a success response with the retrieved company data
  return res
    .status(200)
    .json(new ApiResponse(200, company, "Company retrieved successfully"));
});

// Update Company
const updateCompany = asyncMiddleware(async (req, res) => {
  // Extract the company ID from the request query parameters
  const companyId = req.query.id;

  // Check if a valid company ID is provided
  if (!companyId) {
    throw new ApiError(400, "Please provide Company Id.");
  }

  // Find and update the company with the provided data
  const updatedCompany = await Company.findOneAndUpdate(
    { id: companyId },
    req.body,
    { new: true, runValidators: true }
  );

  // Check if the company is not found
  if (!updatedCompany) {
    throw new ApiError(404, "Company not found.");
  }

  // Return a success response with the updated company data
  return res
    .status(200)
    .json(new ApiResponse(200, updatedCompany, "Company updated successfully"));
});

// Delete Company
const deleteCompany = asyncMiddleware(async (req, res) => {
  // Extract the company ID from the request query parameters
  const companyId = req.query.id;

  // Check if a valid company ID is provided
  if (!companyId) {
    throw new ApiError(400, "Please provide Company Id.");
  }

  // Find and delete the company by the provided ID
  const deletedCompany = await Company.findOneAndDelete({ id: companyId });

  // Check if the company is not found
  if (!deletedCompany) {
    throw new ApiError(404, "Company not found.");
  }

  // Delete all resources associated with the company
  await Resource.deleteMany({ companyId: deletedCompany._id });

  // Delete alumni records associated with the company
  await Alumni.deleteMany({ hiredCompany: deletedCompany._id });

  // Return a success response with the deleted company data
  return res
    .status(200)
    .json(new ApiResponse(200, deletedCompany, "Company deleted successfully"));
});

// Export the company controllers
export {
  addCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
