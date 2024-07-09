import { asyncMiddleware } from "../middlewares/asyncHandler.js";
import { Company } from "../models/company.model.js";
import { CompanyUpdates } from "../models/companyUpdates.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create CompanyUpdates
const AddCompanyUpdate = asyncMiddleware(async (req, res) => {
  // Extract companyId and updates from the request body
  const { companyId, updates } = req.body;

  // Find the company by companyId
  const company = await Company.findOne({ id: companyId });

  // Check if the company exists
  if (!company) {
    throw new ApiError(404, "Company not found.");
  }

  // Check if there are existing CompanyUpdates for the company
  const existingCompanyUpdates = await CompanyUpdates.findOne({
    companyId: companyId,
  });

  // If CompanyUpdates exist, add the new updates; otherwise, create new CompanyUpdates
  if (existingCompanyUpdates) {
    existingCompanyUpdates.updates.push(...updates);
    existingCompanyUpdates.save();
  } else {
    const newCompanyUpdates = new CompanyUpdates({
      companyId: companyId,
      updates: updates,
    });

    await newCompanyUpdates.save();

    // Return a success response with the new CompanyUpdates data
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          newCompanyUpdates,
          "Company Updates successfully created."
        )
      );
  }

  // Return a success response with the existing CompanyUpdates data
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        existingCompanyUpdates,
        "Company Updates successfully created."
      )
    );
});

// Get CompanyUpdates By Company Id
const getCompanyUpadtesById = asyncMiddleware(async (req, res) => {
  // Extract companyId from the request body
  const { companyId } = req.body;

  // Check if companyId is provided
  if (!companyId) {
    throw new ApiError(400, "Please Provide Company Id.");
  }

  // Find the company by companyId
  const company = await Company.findOne({ id: companyId });

  // Check if the company exists
  if (!company) {
    throw new ApiError(400, "Company not found.");
  }

  // Find CompanyUpdates by companyId
  const companyUpdates = await CompanyUpdates.findOne({ companyId: companyId });

  // Return a success response with the retrieved CompanyUpdates data
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        companyUpdates,
        "Company Updates retrieved successfully"
      )
    );
});

// Update CompanyUpdates By CompanyId and UpdateId
const updateCompanyUpdates = asyncMiddleware(async (req, res) => {
  // Extract companyId and updateId from the request body
  const { companyId, updateId, updates } = req.body;

  // Check if companyId is provided
  if (!companyId) {
    throw new ApiError(404, "Please Provide company Id.");
  }

  // Find CompanyUpdates by companyId
  const companyUpdates = await CompanyUpdates.findOne({ companyId });
  // Check if CompanyUpdates exist
  if (!companyUpdates) {
    throw new ApiError(404, "Company Updates not found.");
  }

  // Check if updateId is provided
  if (!updateId) {
    throw new ApiError(404, "Please Provide Update Id.");
  }

  // Find the existing update within CompanyUpdates by updateId
  const existingUpdate = companyUpdates.updates.id(updateId);
  // Check if the existing update is found
  if (!existingUpdate) {
    throw new ApiError(404, "Update not found.");
  }

  // Update fields based on the model structure
  Object.keys(updates[0]).forEach((key) => {
    if (updates[0][key]) {
      existingUpdate[key] = updates[0][key];
    }
  });

  // Save the updated CompanyUpdates
  await companyUpdates.save();

  // Return a success response with the updated update data
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        existingUpdate,
        "Company Updates successfully updated."
      )
    );
});

// Delete Company Updates By companyId and UpdateId
const deleteCompanyUpdate = asyncMiddleware(async (req, res) => {
  // Extract companyId and updateId from the request body
  const { companyId, updateId } = req.body;

  // Check if companyId is provided
  if (!companyId) {
    throw new ApiError(404, "Please Provide company Id.");
  }

  // Find CompanyUpdates by companyId
  const companyUpdates = await CompanyUpdates.findOne({ companyId });
  // Check if CompanyUpdates exist
  if (!companyUpdates) {
    throw new ApiError(404, "Company Updates not found.");
  }

  // Check if updateId is provided
  if (!updateId) {
    throw new ApiError(404, "Please Provide Update Id.");
  }

  // Find the index of the update with the specified updateId
  const indexToRemove = companyUpdates.updates.findIndex(
    (update) => update._id.toString() === updateId
  );

  // Check if the update with updateId was found
  if (indexToRemove !== -1) {
    // Remove the update at the found index
    companyUpdates.updates.splice(indexToRemove, 1);

    // Save the updated CompanyUpdates
    await companyUpdates.save();

    // Return a success response with the deleted update data
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { _id: updateId },
          "CompanyUpdate successfully deleted."
        )
      );
  } else {
    // If update with updateId was not found, return an error response
    throw new ApiError(404, "Update not found.");
  }
});

// Export the CompanyUpdates controllers
export {
  AddCompanyUpdate,
  getCompanyUpadtesById,
  updateCompanyUpdates,
  deleteCompanyUpdate,
};
