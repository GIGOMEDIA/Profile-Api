const express = require("express");
const router = express.Router();

const profileRoutes = require("./profileRoutes");   // adjust if needed
const authRoutes = require("../auth/auth.routes");

router.use("/profiles", profileRoutes);
router.use("/auth", authRoutes);

module.exports = router;