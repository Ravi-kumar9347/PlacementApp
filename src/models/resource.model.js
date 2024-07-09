import mongoose, { Schema } from "mongoose";

const resourceSchema = new mongoose.Schema({
  learning: {
    type: Boolean, // learning == true -> learning resource else apply resource
    required: true,
  },
  companyId: {
    type: String,
  },
  resourceName: {
    type: String,
  },
  resourceLink: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
  },
});

export const Resource = mongoose.model("Resource", resourceSchema);
