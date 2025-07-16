// middleware.js

const jwt = require("jsonwebtoken");
const config = require("./config");

// Middleware function to verify JWT token
function verifyToken(req, res, next) {
  // Get token from header
  let token = req.header("Authorization");
  // Remove 'Bearer ' prefix if present
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  // Check if token is present
  if (!token) {
    return res.status(401).json({
      msg: "No token, authorization denied",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
}

module.exports = verifyToken;
