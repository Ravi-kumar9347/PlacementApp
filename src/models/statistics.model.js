import mongoose from "mongoose";

const statisticsSchema = mongoose.Schema({
  batch: {
    type: String,
    required: true,
    unique: true,
  },
  totalStudentsInBatch: {
    type: Number,
    default: 0,
    required: true,
  },
  totalPlacements: {
    type: Number,
    default: 0,
    required: true,
  },
});

export const Statistics = mongoose.model("Statistics", statisticsSchema);
