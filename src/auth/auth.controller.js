const {
  generateAccessToken,
  generateRefreshToken,
} = require("./token.service");

const login = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username required" });
  }

  // simple mock users
  const users = {
    admin: { id: 1, username: "admin", role: "admin" },
    analyst: { id: 2, username: "analyst", role: "analyst" },
  };

  const user = users[username];

  if (!user) {
    return res.status(401).json({ message: "Invalid user" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({ accessToken, refreshToken });
};

module.exports = { login };