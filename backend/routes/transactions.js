const express = require("express");

const { requireAuth } = require("../middleware/authMiddleware.js");
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/transactionsController.js");

const router = express.Router();

// Get all transactions (protected)
router.get("/", requireAuth, getTransactions);

// Create transaction (protected)
router.post("/", requireAuth, createTransaction);

// Delete transaction (protected)
router.delete("/:id", requireAuth, deleteTransaction);

// Update Transaction (protected)
router.put("/:id", requireAuth, updateTransaction);
module.exports = router;
