import mongoose, { Schema } from "mongoose";

const alumniSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  graduationYear: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  currentCompany: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  contactInformation: {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    linkedinProfile: {
      type: String,
    },
  },
  image: {
    type: String,
  },
});

export const Alumni = mongoose.model("Alumni", alumniSchema);
