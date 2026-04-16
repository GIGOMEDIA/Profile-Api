import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

let isConnected = false;

export default async function handler(req, res) {
  try {
    if (!isConnected) {
      await connectDB();   // ✅ THIS FIXES YOUR ERROR
      isConnected = true;
    }

    return app(req, res);
  } catch (err) {
    console.error("Handler error:", err);

    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
}