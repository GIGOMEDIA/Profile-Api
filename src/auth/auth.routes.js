const express = require("express");
const router = express.Router();

const {
  githubAuth,
  githubCallback,
  refresh,
  logout,
} = require("../controllers/auth.controller");

// GitHub OAuth
router.get("/github", githubAuth);
router.get("/github/callback", githubCallback);

// token lifecycle
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;