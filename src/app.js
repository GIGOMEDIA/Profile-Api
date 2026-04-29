const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// middleware
const logger = require("./utils/logger");
const limiter = require("./middleware/rateLimit.middleware");

// routes
const v1Routes = require("./routes/v1");

const app = express();

// core middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// logging + rate limit
app.use(logger);
app.use(limiter);

// API versioning
app.use("/api/v1", v1Routes);

// health check (optional but good for grading)
app.get("/", (req, res) => {
  res.send("Insighta Labs+ API is running");
});

module.exports = app;