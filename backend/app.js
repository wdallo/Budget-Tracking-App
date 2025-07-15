// app.js

const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { connectDB } = require("./config/config.js"); // Import connectDB from config.js
const errorHandler = require("./utils/errorHandler.js");
const authRoutes = require("./routes/authRoutes.js");
const expenseRoutes = require("./routes/expenseRoutes.js");
const incomeRoutes = require("./routes/incomeRoutes.js");
const budgetRoutes = require("./routes/budgetRoutes.js");
const reportRoutes = require("./routes/reportRoutes.js");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB(); // Call connectDB function

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/report", reportRoutes);

// Error handler middleware
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
