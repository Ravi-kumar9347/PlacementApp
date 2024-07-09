import { Workshop } from "../models/workshop.model.js";
import { asyncMiddleware } from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addWorkshop = asyncMiddleware(async (req, res) => {
  // Extract title, description, date, and images from the request body
  const { title, description, date, images } = req.body;

  // Define a function to generate a required attribute error message
  const required = (attribute) => `Workshop ${attribute} is required.`;

  // Check for the presence of required fields
  if (!title) {
    throw new ApiError(400, required("title"));
  } else if (!description) {
    throw new ApiError(400, required("description"));
  } else if (!date) {
    throw new ApiError(400, required("date"));
  }

  // Create the workshop
  const workshop = new Workshop({
    title,
    description,
    date,
    images,
  });
  await workshop.save();

  // Check if the workshop was successfully saved
  if (!workshop) {
    throw new ApiError("500", "Unable to add workshop to the database.");
  }

  // Return a success response with the workshop data
  return res
    .status(201)
    .json(new ApiResponse(200, workshop, "Workshop added successfully"));
});

// Get All Workshops
const getWorkshops = asyncMiddleware(async (req, res) => {
  // Find all workshops
  const workshops = await Workshop.find();

  // Return a success response with the retrieved workshop data
  return res
    .status(200)
    .json(new ApiResponse(200, workshops, "Workshops retrieved successfully"));
});

export { addWorkshop, getWorkshops };
