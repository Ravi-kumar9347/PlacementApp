const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("MongoDB URI:", process.env.MONGO_URI); // Add this line
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
