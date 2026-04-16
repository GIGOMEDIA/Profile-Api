import express from "express";
import profileRoutes from "./routes/profile.routes.js"; // ✅ correct file name

const app = express();

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "API is running"
  });
});

// Routes (NO /api)
app.use("/", profileRoutes);

export default app;