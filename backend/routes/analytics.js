const express = require("express");
const requireAuth = require("../middleware/authMiddleware.js");
const {
  getSummary,
  getSpendingByCategory,
  getIncomeByCategory,
} = require("../controllers/analyticsController.js");

const router = express.Router();

// Analytics summary (protected)
router.get("/summary", requireAuth, getSummary);

// Analytics spending by category (protected)
router.get("/spending-by-category", requireAuth, getSpendingByCategory);

// Analytics income by category (protected)
router.get("/income-by-category", requireAuth, getIncomeByCategory);

module.exports = router;
