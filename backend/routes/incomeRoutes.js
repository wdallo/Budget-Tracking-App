// incomeRoutes.js

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const incomeController = require("../controllers/incomeController");
const verifyToken = require("../config/middleware");

// Route: GET /api/incomes
// Description: Get all incomes
router.get("/", verifyToken, incomeController.getAllIncomes);

// Route: POST /api/incomes
// Description: Add a new income
router.post(
  "/",
  verifyToken,
  [
    body("amount", "Amount is required").notEmpty(),
    body("description", "Description is required").notEmpty(),
    // Add validation for description if required
  ],
  incomeController.addIncome
);

// Route: DELETE /api/incomes/:id
// Description: Delete an income
router.delete("/:id", verifyToken, incomeController.deleteIncome);

module.exports = router;
