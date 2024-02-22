import { Alumni } from "../models/alumni.model.js";
import { Company } from "../models/company.model.js";
import { asyncMiddleware } from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addAlumni = asyncMiddleware(async (req, res) => {
  const {
    userName,
    name,
    branch,
    batch,
    role,
    contactInformation,
    image,
  } = req.body;

  const requiredFields = [
    "userName",
    "name",
    "graduationYear",
    "branch",
    "batch",
    "role",
    "image",
    "contactInformation.email",
  ];

  for (const field of requiredFields) {
    if (!getFieldValue(req.body, field)) {
      throw new ApiError(400, `Alumni ${field} is required`);
    }
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

  // const newAlumni = new Alumni(req.body);

  // newAlumni.save().then(async (savedAlumni) => {
  //   await Company.find
  // })

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        alumniAdded,
        "successfully added alumni to the database."
      )
    );
});

export {addAlumni};
