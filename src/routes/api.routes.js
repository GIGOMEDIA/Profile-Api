const express = require("express");
const router = express.Router();

const profileRoutes = require("./profileRoutes");

router.use("/profiles", profileRoutes);

module.exports = router;