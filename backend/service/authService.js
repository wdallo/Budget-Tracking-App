// authService.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { validationResult } = require("express-validator");
const User = require("../models/User");

// Function to register a new user
async function registerUser(username, email, password) {
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return { error: "User already exists" };
    }

    // Create new user
    user = new User({ username, email, password });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    return { message: "User registered successfully" };
  } catch (err) {
    console.error(err.message);
    return { error: "Server Error" };
  }
}

// Function to authenticate user and generate JWT token
async function authenticateUser(email, password) {
  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return { error: "Invalid credentials" };
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "Invalid credentials" };
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
    return { token };
  } catch (err) {
    console.error(err.message);
    return { error: "Server Error" };
  }
}

module.exports = { registerUser, authenticateUser };
