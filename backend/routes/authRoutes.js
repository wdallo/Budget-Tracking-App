// authRoutes.js

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const verifyToken = require("../config/middleware");

// Route: POST /api/auth/register
// Description: Register a new user
router.post(
  "/register",
  [
    body("username", "Username is required").notEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  authController.register
);

// Route: POST /api/auth/login
// Description: Authenticate user & get token (login)
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  authController.login
);

// Route: GET /api/auth/user
// Description: Get user data (protected route)
router.get("/user", verifyToken, authController.getUser);

module.exports = router;
