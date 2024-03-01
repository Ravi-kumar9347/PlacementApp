import { Alumni } from "../models/alumni.model.js";
import { Company } from "../models/company.model.js";
import { asyncMiddleware } from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create Alumni
const addAlumni = asyncMiddleware(async (req, res) => {
  // Destructure required fields from the request body
  const {
    userName,
    name,
    branch,
    batch,
    role,
    hiredCompany,
    contactInformation,
    image,
  } = req.body;

  // Define required fields with their corresponding labels
  const requiredFields = {
    userName: "User Name",
    name: "Name",
    branch: "Branch",
    batch: "Batch",
    hiredCompany: "Hired Company ID",
    role: "Role",
  };

  // Check if required fields are provided
  for (const [field, label] of Object.entries(requiredFields)) {
    if (!req.body[field]) {
      throw new ApiError(400, `${label} is required`);
    }
  }

  // Check if email is provided in contactInformation
  if (!contactInformation || !contactInformation.email) {
    throw new ApiError(400, "Email is required");
  }

  // Check if Alumni with the same username already exists
  const alumniExists = await Alumni.findOne({ userName });
  if (alumniExists) {
    throw new ApiError(409, "Username already exists.");
  }

  // Find the company by the provided hiredCompany ID
  const company = await Company.findOne({ id: hiredCompany });
  if (!company) {
    throw new ApiError(404, "Company not found.");
  }

  // Create a new Alumni instance with the provided data
  const newAlumni = new Alumni({
    userName,
    name,
    branch,
    batch,
    role,
    hiredCompany: company._id,
    contactInformation,
    image,
  });

  // Save the new Alumni to the database
  newAlumni.save().then(async (savedAlumni) => {
    // Update the company's pastHiring records
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

  // Return a success response with the added Alumni data
  return res
    .status(201)
    .json(new ApiResponse(200, newAlumni, "Alumni Created."));
});

// Get All Alumnis
const getAlumnis = asyncMiddleware(async (req, res) => {
  // Retrieve all alumni from the database
  const alumnis = await Alumni.find();

  // Return a success response with the retrieved alumni data
  return res
    .status(200)
    .json(new ApiResponse(200, alumnis, "Alumnis retrieved successfully"));
});

// Get Alumni By Username
const getAlumniById = asyncMiddleware(async (req, res) => {
  // Extract the Alumni username from the request query parameters
  const userName = req.query.userName;

  // Check if Alumni username is provided
  if (!userName) {
    throw new ApiError(400, "Please Provide Alumni Username.");
  }

  // Find Alumni by the provided username
  const alumni = await Alumni.findOne({ userName });
  // Check if Alumni is not found
  if (!alumni) {
    throw new ApiError(400, "Alumni not found.");
  }

  // Return a success response with the retrieved Alumni data
  return res
    .status(200)
    .json(new ApiResponse(200, alumni, "Alumni retrieved successfully"));
});

// Update Alumni By Username
const updateAlumni = asyncMiddleware(async (req, res) => {
  const userName = req.query.userName;
  if (!userName) {
    throw new ApiError(400, "Please provide Alumni Username.");
  }

  const { name, branch, batch, role, hiredCompany, contactInformation, image } =
    req.body;

  // Fetch the existing alumni
  const existingAlumni = await Alumni.findOne({ userName });
  if (!existingAlumni) {
    throw new ApiError(404, "Alumni not found.");
  }

  if (hiredCompany) {
    const newCompany = await Company.findOne({ id: hiredCompany });
    if (!newCompany) {
      throw new ApiError(400, "Hired Company doesn't exist");
    }

    if (String(existingAlumni.hiredCompany) !== String(newCompany._id)) {
      // Remove alumni from the old company
      const oldCompany = await Company.findById(existingAlumni.hiredCompany);
      if (oldCompany) {
        oldCompany.pastHiring.forEach((record) => {
          const index = record.alumni.indexOf(existingAlumni._id);
          if (index !== -1) {
            record.alumni.splice(index, 1);
          }
          // Remove batch if it has no alumni after deletion
          if (record.alumni.length === 0) {
            const batchIndex = oldCompany.pastHiring.indexOf(record);
            oldCompany.pastHiring.splice(batchIndex, 1);
          }
        });
        await oldCompany.save();
      }
    }

    existingAlumni.hiredCompany = newCompany._id;

    if (
      String(existingAlumni.hiredCompany) !== String(newCompany._id) ||
      (batch && String(batch) !== String(existingAlumni.batch))
    ) {
      // Add alumni to the new company
      var alumniBatch;
      if (batch) {
        alumniBatch = batch.toString();
      } else {
        alumniBatch = existingAlumni.batch;
      }
      const batchObject = newCompany.pastHiring.find(
        (record) => record.batch === alumniBatch
      );
      if (batchObject) {
        // Batch exists, add alumni to the existing batch
        batchObject.alumni.push(existingAlumni._id);
      } else {
        // Batch doesn't exist, create a new batch object
        newCompany.pastHiring.push({
          batch: alumniBatch,
          alumni: [existingAlumni._id],
        });
      }

      await newCompany.save();
    }
  } else if (batch && String(batch) !== String(existingAlumni.batch)) {
    const oldCompany = await Company.findById(existingAlumni.hiredCompany);

    // Find and remove alumni from the existing batch
    const batchObjectToRemove = oldCompany.pastHiring.find(
      (record) => record.batch === existingAlumni.batch
    );

    if (batchObjectToRemove) {
      const indexToRemove = batchObjectToRemove.alumni.indexOf(
        existingAlumni._id
      );
      if (indexToRemove !== -1) {
        batchObjectToRemove.alumni.splice(indexToRemove, 1);

        // Remove batch if it has no alumni after deletion
        if (batchObjectToRemove.alumni.length === 0) {
          const batchIndexToRemove =
            oldCompany.pastHiring.indexOf(batchObjectToRemove);
          oldCompany.pastHiring.splice(batchIndexToRemove, 1);
        }

        await oldCompany.save();
      }
    }

    // Add alumni to the new batch
    const newCompany = await Company.findOne({ id: hiredCompany });
    if (!newCompany) {
      throw new ApiError(400, "Hired Company doesn't exist");
    }

    const batchObjectToAdd = newCompany.pastHiring.find(
      (record) => record.batch === batch
    );

    if (batchObjectToAdd) {
      // Batch exists, add alumni to the existing batch
      batchObjectToAdd.alumni.push(existingAlumni._id);
    } else {
      // Batch doesn't exist, create a new batch object
      newCompany.pastHiring.push({
        batch: batch,
        alumni: [existingAlumni._id],
      });
    }

    await newCompany.save();
  }

  if (name) {
    existingAlumni.name = name;
  }

  if (batch) {
    existingAlumni.batch = batch;
  }

  if (branch) {
    existingAlumni.branch = branch;
  }

  if (role) {
    existingAlumni.role = role;
  }

  if (contactInformation) {
    existingAlumni.contactInformation = contactInformation;
  }

  if (image) {
    existingAlumni.image = image;
  }

  await existingAlumni.save();

  return res
    .status(200)
    .json(new ApiResponse(200, existingAlumni, "Alumni updated successfully"));
});

// Delete Alumni By Username
const deleteAlumni = asyncMiddleware(async (req, res) => {
  // Extract the Alumni username from the request query parameters
  const userName = req.query.userName;
  if (!userName) {
    throw new ApiError(400, "Please provide Alumni Username.");
  }

  // Find and delete Alumni by the provided username
  const deletedAlumni = await Alumni.findOneAndDelete({ userName });
  if (!deletedAlumni) {
    throw new ApiError(404, "Alumni not found.");
  }

  // Update the company's pastHiring records
  const company = await Company.findById(deletedAlumni.hiredCompany);
  if (company) {
    company.pastHiring.forEach((record) => {
      const index = record.alumni.indexOf(deletedAlumni._id);
      if (index !== -1) {
        record.alumni.splice(index, 1);
      }
      // Remove batch if it has no alumni after deletion
      if (record.alumni.length === 0) {
        const batchIndex = company.pastHiring.indexOf(record);
        company.pastHiring.splice(batchIndex, 1);
      }
    });
    await company.save();
  }

  // Return a success response with the deleted Alumni data
  return res
    .status(200)
    .json(new ApiResponse(200, deletedAlumni, "Alumni deleted successfully"));
});

// Export the Alumni controllers
export { addAlumni, getAlumnis, getAlumniById, updateAlumni, deleteAlumni };
