import mongoose, { Schema } from "mongoose";

const resourceSchema = mongoose.Schema({
  learning: {
    type: Boolean,
    required: true,
  },
  companyname: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: false,
  },
  resourceLink: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
  },
});

export const Resoruce = mongoose.model("Resource", resourceSchema);
