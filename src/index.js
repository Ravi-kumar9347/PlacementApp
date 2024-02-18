import { app } from "./app.js";
import {connectDB} from "./config/db.js";

connectDB()
  .then(
    app.listen(process.env.PORT || 8000, () => {
      console.log("Database connection established successfully.");
    }),
  )
  .catch((err) => {
    console.log("error while connecting to database", err);
  });
