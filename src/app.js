import express from "express";
import profileRoutes from "./routes/profile.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "API is running"
  });
});

// 🔥 cover both cases
app.use("/api", profileRoutes);
app.use("/", profileRoutes);

export default app;