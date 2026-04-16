import express from "express";
import profileRoutes from "./routes/profile.routes.js";

const app = express();

app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.json({ status: "success", message: "API is running" });
});

// IMPORTANT
app.use("/api", profileRoutes);

export default app;