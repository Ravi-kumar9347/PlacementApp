import mongoose, { Schema } from "mongoose";

const resourceSchema = mongoose.Schema({
  learning: {
    type: Boolean,
    required: true,
  },
  companyName: {
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
