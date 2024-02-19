import mongoose from "mongoose";

const statisticsSchema = mongoose.Schema({
  batch: {
    type: String,
    required: true,
  },
  totalStudentsInBatch: {
    type: Number,
    default: 0,
  },
  totalPlacements: {
    type: Number,
    default: 0,
  },
});

export const Statistics = mongoose.model("Statistics", statisticsSchema);
