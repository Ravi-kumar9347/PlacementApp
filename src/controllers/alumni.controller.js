import { Alumni } from "../models/alumni.model";
import { Company } from "../models/company.model";
import { asyncMiddleware } from "../middlewares/asyncHandler";
import { ApiError, ApiResponse } from "../utils/ApiError";

export const addAlumni = asyncMiddleware(async (req, res) => {
  const {
    userName,
    name,
    graduationYear,
    branch,
    batch,
    role,
    currentCompany,
    contactInformation,
    image,
  } = req.body;

  const required = (attribute) => `Alumni ${attribute} is required`;

  if (!userName) {
    throw new ApiError(400, required("username"));
  } else if (!name) {
    throw new ApiError(400, required("name"));
  } else if (!graduationYear) {
    throw new ApiError(400, required("graduation year"));
  } else if (!branch) {
    throw new ApiError(400, required("branch"));
  } else if (!batch) {
    throw new ApiError(400, required("batch"));
  } else if (!role) {
    throw new ApiError(400, required("role"));
  } else if (!currentCompany) {
    throw new ApiError(400, required("current company"));
  } else if (!contactInformation || !contactInformation.email) {
    throw new ApiError(400, required("contact email"));
  } else if (!image) {
    throw new ApiError(400, required("image"));
  }

  const alumniExists = await Alumni.findOne({ userName });
  if (alumniExists) {
    throw new ApiError(409, "username already exists.");
  }

  const company = await Company.findOne({ currentCompany });
  if (!company) {
    throw new ApiError(404, "Company not found.");
  }

  const alumniAdded = Alumni.create(req.body);
  if (!alumniAdded) {
    throw new ApiError("500", "Unable to add alumni to the database.");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        alumniAdded,
        "successfully added alumni to the database.",
      ),
    );
});
