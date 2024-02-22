import { asyncMiddleware } from "../middlewares/asyncHandler.js";
import { Company } from "../models/company.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addcompany = asyncMiddleware(async (req, res) => {
  const { companyId, name, location, visitStatus } = req.body;

  const required = (attribute) => `${attribute} is required.`;

  if (!companyId) {
    throw new ApiError(400, required("companyId"));
  } else if (!name) {
    throw new ApiError(400, required("name"));
  } else if (!location) {
    throw new ApiError(400, required("location"));
  } else if (!visitStatus) {
    throw new ApiError(400, required("visit status"));
  }
  const companyExists = Company.findOne({
    companyName,
  });

  console.log(companyExists);
  if (companyExists) {
    throw new ApiError(409, "Company already exists.");
  }

  const companyAdded = new Company(req.body);

  await companyAdded.save();

  if (!companyAdded) {
    throw new ApiError("500", "Unable to add company to the database.");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        companyAdded,
        "successfully added company to the database."
      )
    );
});

//get companies controller
const getCompanies = asyncMiddleware(async (req, res) => {
  const companies = await Company.find();

  res
    .status(200)
    .json(new ApiResponse(200, companies, "Companies retrieved successfully"));
});

//get single company by id
const getCompanyById = asyncMiddleware(async (req, res) => {
  const companyId = req.params.companyId;

  if (!companyId || isNaN(companyId)) {
    throw new ApiError(400, "Invalid companyId provided.");
  }

  const company = Company.findOne({ companyId });
  if (!company) {
    throw new ApiError(400, "Company not found.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, company, "Company retrieved successfully"));
});

export { addcompany };
