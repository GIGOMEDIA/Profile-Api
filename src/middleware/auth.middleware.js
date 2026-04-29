module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  // accept only our mock token
  if (token !== "valid-token") {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  req.user = { role: "admin" };
  next();
};