// app.js

const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const rateLimit = require("express-rate-limit");
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
const frontEnd = "http://localhost:5173";
const corsOptions = {
  origin: frontEnd, // Remove trailing slash for strict match
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 5 requests per windowMs for testing
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers

  handler: (req, res) => {
    console.log(`Rate limit exceeded for IP: ${req.ip}`);
    const userAgent = req.get("User-Agent") || "";

    // Check if the request is from a browser or terminal/API client
    const isBrowser =
      userAgent.includes("Mozilla") ||
      userAgent.includes("Chrome") ||
      userAgent.includes("Safari") ||
      userAgent.includes("Firefox") ||
      userAgent.includes("Edge");

    if (isBrowser) {
      // For browser users - they will be redirected by the frontend interceptor
      res.status(429).json({
        error: "Too many requests from this IP, please try again later.",
        retryAfter: "15 minutes",
        userType: "browser",
      });
    } else {
      // For terminal/API users - provide a different help URL
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      res.status(429).json({
        error: "Too many requests from this IP, please try again later.",
        retryAfter: "15 minutes",
        userType: "terminal",
        helpUrl: `${baseUrl}/rate-limits.html`,
        message: `For rate limit information and API usage guidelines, visit: ${baseUrl}/rate-limits.html`,
        contact:
          "If you need higher rate limits, contact support@yourlibrary.com",
      });
    }
  },
});
app.use(limiter);
app.use(cors(corsOptions));
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
