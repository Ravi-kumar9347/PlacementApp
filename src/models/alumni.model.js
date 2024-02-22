import mongoose, { Schema } from "mongoose";

const alumniSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
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
  hiredCompany: {
    type: Schema.Types.ObjectId,
    ref: "Company",
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
    required: true,
  },
});

export const Alumni = mongoose.model("Alumni", alumniSchema);
