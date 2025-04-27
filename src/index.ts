import dotenv from "dotenv";
import app from "./app";
import { database } from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 3000;

database
  .connect()
  .then(() => {
    console.log("Connected to the database successfully");

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err: any) => {
    console.error("Database connection error", err);
    process.exit(1);
  });
