const express = require("express");

const requireAuth = require("../middleware/authMiddleware.js");
const {
  getBudgets,
  createBudget,
} = require("../controllers/budgetsController.js");

const router = express.Router();

// Get all budgets (protected)
router.get("/", requireAuth, getBudgets);

// Create budget (protected)
router.post("/", requireAuth, createBudget);

// TODO: Add update, delete, and other routes using controller

module.exports = router;
