import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

// ✅ CONNECT DB AFTER dotenv loads
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  })
  .catch((err) => {
    console.error("DB connection error:", err.message);
  });