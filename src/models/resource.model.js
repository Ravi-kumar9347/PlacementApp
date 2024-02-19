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
  applyLink: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
});

export const Resouce = mongoose.model("Resource", resourceSchema);
