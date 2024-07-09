import mongoose from 'mongoose';

// Define the workshop schema
const workshopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  images: [String] // Array of image URLs
});

export const Workshop = mongoose.model("Workshop", workshopSchema);
