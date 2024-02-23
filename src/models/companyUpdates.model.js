import mongoose from "mongoose";

const companyUpdatesSchema = new mongoose.Schema({
  companyId: {
    type: String,
    required: true,
  },
  updates: [
    {
      updateMessage: {
        type: String,
        required: true,
      },
      images: [
        {
          type: String,
        },
      ],
      links: [
        {
          type: String,
        },
      ],
    },
  ],
});

export const CompanyUpdates = mongoose.model(
  "CompanyUpdate",
  companyUpdatesSchema
);
