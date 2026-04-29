const express = require("express");
const router = express.Router();

const {
  getProfiles,
  searchProfiles,
  exportProfiles,
} = require("../controllers/profileController");

const auth = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

// protect all routes
router.use(auth);

// routes
router.get("/", getProfiles);
router.get("/search", searchProfiles);

// ADMIN ONLY EXPORT
router.get("/export", requireRole("admin"), exportProfiles);

module.exports = router;