import { Statistics } from "../models/statistics.model";
import { asyncMiddleware } from "../middlewares/asyncHandler";
import { ApiError, ApiResponse } from "../utils/ApiError";

const createStatistics = asyncMiddleware(async (req, res, next) => {
  const { batch, totalStudentsInBatch, totalPlacements } = req.body;

  const required = (attribute) => `Statistics ${attribute} is required.`;

  if (!batch) {
    throw new ApiError(400, required("batch"));
  } else if (!totalStudentsInBatch) {
    throw new ApiError(400, required("total students in batch"));
  } else if (!totalPlacements) {
    throw new ApiError(400, required("total placements"));
  }

  const existingStatistics = await Statistics.findOne({ batch });
  if (existingStatistics) {
    const uniqueError = new ApiError(400, "Batch must be unique.");
    return res.status(400).json(uniqueError);
  }

  const newStatistics = Statistics.create(req.body);

  if (!newStatistics) {
    throw new ApiError("500", "Unable to add statistics to the database.");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, newStatistics, "Statistics created successfully")
    );
});

export { createStatistics };
