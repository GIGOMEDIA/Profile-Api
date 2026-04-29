const express = require("express");
const app = express();

app.use(express.json());

// ROUTES
const profileRoutes = require("./routes/profileRoutes");
const authRoutes = require("./routes/auth.routes");

app.use("/api/v1/profiles", profileRoutes);
app.use("/api/v1/auth", authRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Insighta Labs+ API is running");
});

module.exports = app;