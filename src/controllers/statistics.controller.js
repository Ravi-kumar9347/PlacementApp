import { Statistics } from "../models/statistics.model.js";
import { asyncMiddleware } from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addOrUpdateStatistics = asyncMiddleware(async (req, res, next) => {
  // Extract all relevant fields from the request body
  const {
    batch,
    totalStudentsInBatch,
    totalPlacements,
    totalBoys,
    totalGirls,
    numberOfBoysPlaced,
    numberOfGirlsPlaced,
  } = req.body;

  // Define required fields with their corresponding labels
  const requiredFields = {
    batch: "Batch",
    totalStudentsInBatch: "Total Students in Batch",
    totalPlacements: "Total Placements",
    totalBoys: "Total Boys",
    totalGirls: "Total Girls",
    numberOfBoysPlaced: "Number of Boys Placed",
    numberOfGirlsPlaced: "Number of Girls Placed",
  };

  // Check if required fields are provided
  for (const [field, label] of Object.entries(requiredFields)) {
    if (req.body[field] === undefined) {
      // Using `undefined` to check for all falsy values including 0 and empty strings
      throw new ApiError(400, `${label} is required`);
    }
  }

  // Find existing statistics by batch
  const existingStatistics = await Statistics.findOne({ batch });

  // If statistics exist for the batch, update the existing data
  if (existingStatistics) {
    existingStatistics.totalStudentsInBatch = totalStudentsInBatch;
    existingStatistics.totalPlacements = totalPlacements;
    existingStatistics.totalBoys = totalBoys;
    existingStatistics.totalGirls = totalGirls;
    existingStatistics.numberOfBoysPlaced = numberOfBoysPlaced;
    existingStatistics.numberOfGirlsPlaced = numberOfGirlsPlaced;
    await existingStatistics.save();

    // Return a success response with the updated statistics data
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          existingStatistics,
          "Statistics updated successfully"
        )
      );
  }

  // If no existing statistics found, create and save new statistics
  const newStatistics = new Statistics(req.body);
  await newStatistics.save();

  // Check if the new statistics were successfully saved
  if (!newStatistics) {
    throw new ApiError("500", "Unable to add statistics to the database.");
  }

  // Return a success response with the newly created statistics data
  return res
    .status(201)
    .json(
      new ApiResponse(200, newStatistics, "Statistics created successfully")
    );
});

// Get All Statistics
const getStatistics = asyncMiddleware(async (req, res) => {
  // Find all statistics
  const statistics = await Statistics.find();

  // Return a success response with the retrieved statistics data
  return res
    .status(200)
    .json(
      new ApiResponse(200, statistics, "Statistics retrieved successfully")
    );
});

// Delete Statistics By Batch
const deleteStatistics = asyncMiddleware(async (req, res) => {
  // Extract batch from the request body
  const { batch } = req.body;

  // Check if batch parameter is provided
  if (!batch) {
    throw new ApiError(400, "Batch parameter is required.");
  }

  // Find and delete statistics by batch
  const deletedStatistics = await Statistics.findOneAndDelete({ batch });

  // If no statistics found for the provided batch, throw an error
  if (!deletedStatistics) {
    throw new ApiError(404, `Statistics with batch ${batch} not found.`);
  }

  // Return a success response with the deleted statistics data
  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedStatistics, "Statistics deleted successfully")
    );
});

// Export the Statistics controllers
export { addOrUpdateStatistics, getStatistics, deleteStatistics };
