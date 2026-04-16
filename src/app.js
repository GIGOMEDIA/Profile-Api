import express from "express";
import cors from "cors";
import profileRoutes from "./routes/profile.routes.js";

const app = express();

// Proper CORS (fixes "Missing CORS header")
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Routes
app.use("/api", profileRoutes);

// Default route (prevents HTML response issue)
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "API is running"
  });
});

export default app;