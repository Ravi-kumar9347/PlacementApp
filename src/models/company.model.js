import mongoose, { Schema } from "mongoose";

const companySchema = new mongoose.Schema({
  companyId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  logo: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  location: {
    type: String,
    required: true,
  },
  linkedin: {
    type: String,
  },
  instagram: {
    type: String,
  },
  website: {
    type: String,
  },
  pastHiring: [
    {
      year: {
        type: String,
      },
      alumni: [
        {
          type: Schema.Types.ObjectId,
          ref: "Alumni",
        },
      ],
    },
  ],
  visitStatus: {
    type: String,
    required: true,
  },
  resource: {
    type: Schema.Types.ObjectId,
    ref: "Resource",
  },
});

export const Company = mongoose.model("Company", companySchema);
