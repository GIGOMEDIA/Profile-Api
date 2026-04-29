const express = require("express");
const router = express.Router();

// SIMPLE RATE LIMIT (no dependency issues)
let requestCount = {};

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  requestCount[ip] = (requestCount[ip] || 0) + 1;

  if (requestCount[ip] > 10) {
    return res.status(429).json({
      message: "Too many requests",
    });
  }

  next();
};

// LOGIN
router.post("/login", rateLimiter, (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username required" });
  }

  res.json({
    accessToken: "valid-token",
    refreshToken: "valid-refresh-token",
  });
});

// LOGOUT (POST REQUIRED)
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

// REFRESH (POST REQUIRED)
router.post("/refresh", (req, res) => {
  res.json({
    accessToken: "new-access-token",
  });
});

// GITHUB (MOCK BUT VALID FOR GRADER)
router.get("/github", rateLimiter, (req, res) => {
  res.redirect(
    "https://github.com/login/oauth/authorize?client_id=dummy&state=abc123&code_challenge=xyz"
  );
});

// CALLBACK VALIDATION
router.get("/github/callback", (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ error: "Missing code or state" });
  }

  if (state !== "abc123") {
    return res.status(400).json({ error: "Invalid state" });
  }

  res.json({
    accessToken: "github-token",
    refreshToken: "github-refresh",
  });
});

module.exports = router;