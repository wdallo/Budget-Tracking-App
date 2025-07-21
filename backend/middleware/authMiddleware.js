const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes and attach user to req
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: "JWT secret not configured" });
    }
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const requireAdmin = async (req, res, next) => {
  // Assumes requireAuth has already run and set req.user
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

module.exports = { requireAuth, requireAdmin };
