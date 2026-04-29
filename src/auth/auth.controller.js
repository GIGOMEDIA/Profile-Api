const axios = require("axios");
const qs = require("qs");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

const refreshTokensStore = require("../store/refreshTokens");

// MOCK USERS
const users = [
  { id: 1, username: "admin", role: "admin" },
  { id: 2, username: "analyst", role: "analyst" },
];

// ================= GITHUB OAUTH =================
const githubCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      qs.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
      { headers: { Accept: "application/json" } }
    );

    const githubToken = tokenRes.data.access_token;

    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${githubToken}` },
    });

    const user = userRes.data;

    const role = "analyst";

    const accessToken = generateAccessToken({
      id: user.id,
      role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
    });

    refreshTokensStore.add(refreshToken);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: "OAuth failed" });
  }
};

// ================= LOGIN =================
const login = (req, res) => {
  const { username } = req.body;

  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  refreshTokensStore.add(refreshToken);

  return res.json({
    accessToken,
    refreshToken,
  });
};

// ================= REFRESH =================
const refresh = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshTokensStore.has(refreshToken)) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    // rotation
    refreshTokensStore.delete(refreshToken);

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      role: "analyst",
    });

    const newRefreshToken = generateRefreshToken({
      id: decoded.id,
    });

    refreshTokensStore.add(newRefreshToken);

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return res.status(403).json({ error: "Expired or invalid token" });
  }
};

// ================= LOGOUT =================
const logout = (req, res) => {
  const { refreshToken } = req.body;

  refreshTokensStore.delete(refreshToken);

  return res.json({ message: "Logged out" });
};

module.exports = {
  githubCallback,
  login,
  refresh,
  logout,
};