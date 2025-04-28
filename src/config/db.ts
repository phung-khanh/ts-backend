import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.DB_URL) throw new Error("DB_URL is not defined");
    await mongoose.connect(process.env.DB_URL);
    console.log("Connect DB successfully");
  } catch (error) {
    console.log("Connect DB failed");
  }
};

export default connectDB;
