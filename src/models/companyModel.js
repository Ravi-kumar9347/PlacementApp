import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
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
          type: mongoose.Schema.Types.ObjectId,
          ref: "Alumni",
        },
      ],
    },
  ],
  visitStatus: {
    type: String,
    required: true,
  },
});

const Company = mongoose.model("Company", companySchema);

export default Company;
