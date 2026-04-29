const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_SECRET || "secret123";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh123";

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    ACCESS_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};