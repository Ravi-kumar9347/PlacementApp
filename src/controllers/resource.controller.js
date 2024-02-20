import { asyncMiddleware } from "../middlewares/asyncHandler.js";
import { Resource } from "../models/resource.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const addResource = asyncMiddleware(async (req, res) => {
  const { learning, companyname, resourceLink, endDate } = req.body;

  const required = (attribute) => `${attribute} is required.`;

  if (!learning) {
    throw new ApiError(400, required("learning"));
  } else if (!resourceLink) {
    throw new ApiError(400, required("resource link"));
  }

  const createdResource = Resource.create(req.body);

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdResource, "successfully created resource."),
    );
});
