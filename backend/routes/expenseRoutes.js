// expenseRoutes.js

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const expenseController = require("../controllers/expenseController");
const verifyToken = require("../config/middleware");

// Route: GET /api/expenses
// Description: Get all expenses
router.get("/", verifyToken, expenseController.getAllExpenses);

// Route: POST /api/expenses
// Description: Add a new expense
router.post(
  "/",
  verifyToken,
  [
    body("amount", "Amount is required").notEmpty(),
    body("category", "Category is required").notEmpty(),
  ],
  expenseController.addExpense
);

// Route: DELETE /api/expenses/:id
// Description: Delete an expense
router.delete("/:id", verifyToken, expenseController.deleteExpense);

module.exports = router;
