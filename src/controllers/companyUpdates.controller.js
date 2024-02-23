import { asyncMiddleware } from "../middlewares/asyncHandler.js";
import { Company } from "../models/company.model.js";
import { CompanyUpdates } from "../models/companyUpdates.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const pushCompanyUpdate = asyncMiddleware(async (req, res) => {
    const {
        companyId,
        update
    } = req.body;

    const company = await Company.findOne({
        id: companyId
    })

    console.log(company, companyId);

    if (!company) {
        throw new ApiError(404, "Company not found.");
    }

    const existingCompanyUpdates = await CompanyUpdates.findOne({
        companyId,
    });

    if (existingCompanyUpdates) {
        existingCompanyUpdates.updates.push(update);
        existingCompanyUpdates.save();
    } else {
        const newCompanyUpdates = new CompanyUpdates({
            companyId: companyId,
            updates: [update]
        })

        await newCompanyUpdates.save();

        return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                newCompanyUpdates,
                "Company Updates successfully created."
            )
        )
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                existingCompanyUpdates,
                "Company Update successfully added."
            )
        )
});

export {pushCompanyUpdate};