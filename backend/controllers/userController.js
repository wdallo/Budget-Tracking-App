const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/// Get users
const getUsers = async (req, res) => {
  try {
    // Only admin can access
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
/// Count users
const getUserCount = async (req, res) => {
  try {
    // Only admin can access
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update user by id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Only admin or the user themselves can update
    if (!req.user || (req.user.role !== "admin" && req.user.userId !== id)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const { firstName, lastName, email } = req.body;
    const updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (email) {
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      updateFields.email = email.trim();
    }
    const user = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
// Delete user by id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Only admin can delete
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Only admin can toggle ban status
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role === "admin") {
      return res.status(400).json({ error: "Cannot ban/unban an admin" });
    }

    user.status = user.status === "banned" ? "active" : "banned";
    await user.save();
    res.json({
      message: `User ${
        user.status === "banned" ? "banned" : "unbanned"
      } successfully`,
      status: user.status,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Register a new user
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password.trim() ||
      !emailRegex.test(email.trim())
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const existingUser = await User.findOne({ email: email.trim() });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email: email.trim(),
      password: hashedPassword,
      role: "user", // default role
      status: "active",
    });
    await user.save();
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT_SECRET not set");
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "365d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: "active",
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate input to prevent injection
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password.trim() ||
      !emailRegex.test(email.trim())
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT_SECRET not set");
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      jwtSecret,
      { expiresIn: "365d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const verify = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT_SECRET not set");
    const decoded = jwt.verify(token, jwtSecret);
    // Fetch user from DB for up-to-date info
    const user = await User.findById(decoded.userId).select("-password");
    if (!user)
      return res.status(401).json({ valid: false, error: "User not found" });
    res.json({
      valid: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    res.status(401).json({ valid: false, error: "Invalid token" });
  }
};

module.exports = {
  getUsers,
  getUserCount,
  updateUser,
  deleteUser,
  banUser,
  register,
  login,
  verify,
};
