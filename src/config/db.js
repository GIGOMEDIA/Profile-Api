import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB Error:", err.message);
    console.error("Full error:", err);
    
    // Retry logic - don't crash immediately
    console.log("Retrying connection in 5 seconds...");
    setTimeout(() => connectDB(), 5000);
  }
};