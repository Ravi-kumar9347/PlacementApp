import { asyncMiddleware } from "../middlewares/asyncHandler.js";
import { Company } from "../models/company.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addcompany = asyncMiddleware(async (req, res) => {
    const {
        name,
        location,
        visitStatus,
    } = req.body;

    const required = (attribute) => `Company ${attribute} is required.`;

    if (!name) {
        throw new ApiError(400, required("name"));
    } else if (!location) {
        throw new ApiError(400, required("location"));
    } else if (!visitStatus) {
        throw new ApiError(400, required("visit status"));
    } 

    const companyExists = Company.findOne({
        name,
    })

    if (companyExists) {
        throw new ApiError(409, "Company already exists.");
    }

    const companyAdded = Company.create(req.body);

    if (!companyAdded) {
        throw new ApiError("500", "Unable to add company to the database.");
    }
    
    return res
    .status(201)
    .json(new ApiResponse(
        200, 
        companyAdded,
        "successfully added company to the database.",
    ));
});