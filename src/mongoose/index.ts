import mongoose from "mongoose";
import Config from "../config";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(Config.mongodbUri);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
