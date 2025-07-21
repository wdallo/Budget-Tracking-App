const express = require("express");

const { requireAuth } = require("../middleware/authMiddleware.js");
const {
  getBudgets,
  createBudget,
  deleteBudget,
  updateBudget,
} = require("../controllers/budgetsController.js");

const router = express.Router();

// Get all budgets (protected)
router.get("/", requireAuth, getBudgets);

// Create budget (protected)
router.post("/", requireAuth, createBudget);

// Delete budget (protected)
router.delete("/:id", requireAuth, deleteBudget);

// Update budget (protected)
router.put("/:id", requireAuth, updateBudget);
// TODO: Add update, delete, and other routes using controller

module.exports = router;
