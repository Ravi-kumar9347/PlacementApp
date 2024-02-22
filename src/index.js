import { app } from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

connectDB()
  .then(
    app.listen(process.env.PORT || 8000, () => {
      console.log("Database connection established successfully." + process.env.PORT || 8000);
    }),
  )
  .catch((err) => {
    console.log("error while connecting to database", err);
  });
