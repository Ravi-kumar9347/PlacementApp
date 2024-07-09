import mongoose from "mongoose";

const statisticsSchema = new mongoose.Schema({
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
  totalBoys: {
    type: Number,
    default: 0,
    required: true,
  },
  totalGirls: {
    type: Number,
    default: 0,
    required: true,
  },
  numberOfBoysPlaced: {
    type: Number,
    default: 0,
    required: true,
  },
  numberOfGirlsPlaced: {
    type: Number,
    default: 0,
    required: true,
  },
});

export const Statistics = mongoose.model("Statistics", statisticsSchema);
