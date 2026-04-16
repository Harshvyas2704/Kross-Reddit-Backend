import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`[DATABASE LOCKED] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[FATAL BUG] Database connection failed:`, error);
    process.exit(1);
  }
};
