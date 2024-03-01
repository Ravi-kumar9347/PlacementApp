import mongoose, { Schema } from "mongoose";

const resourceSchema = mongoose.Schema({
  learning: {
    type: Boolean, //learning == true -> learning resource else apply resource
    required: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
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
