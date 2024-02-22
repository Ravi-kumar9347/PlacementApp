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
    hiredCompanyId,
    role,
    contactInformation,
    image,
  } = req.body;

  const requiredFields = {
    userName: "User Name",
    name: "Name",
    branch: "Branch",
    batch: "Batch",
    hiredCompanyId: "Hired Company ID",
    role: "Role",
    "contactInformation.email": "Email",
  };

  for (const [field, label] of Object.entries(requiredFields)) {
    if (!req.body[field]) {
      throw new ApiError(400, `${label} is required`);
    }
  }

  const alumniExists = await Alumni.findOne({ userName });
  if (alumniExists) {
    throw new ApiError(409, "username already exists.");
  }

  const company = await Company.findOne({ companyId: hiredCompanyId });
  if (!company) {
    throw new ApiError(404, "Company not found.");
  }

  const newAlumni = new Alumni(req.body);

  newAlumni.save().then(async (savedAlumni) => {
    const pastHiringRecord = company.pastHiring.find(
      (record) => record.batch === batch
    );
    if (!pastHiringRecord) {
      company.pastHiring.push({ batch: batch, alumni: [savedAlumni._id] });
    } else {
      pastHiringRecord.alumni.push(savedAlumni._id);
    }
    await company.save();
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        newAlumni,
        "successfully added alumni to the database."
      )
    );
});

export { addAlumni };
