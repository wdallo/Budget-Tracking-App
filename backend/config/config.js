// config.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

module.exports = {
  mongoURI: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  email: {
    host: process.env.EMAIL_HOST || "smtp.example.com",
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER || "your_email@example.com",
    pass: process.env.EMAIL_PASS || "your_email_password",
  },
  connectDB,
};
