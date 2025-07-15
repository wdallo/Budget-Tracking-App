// budgetRoutes.js

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const budgetController = require("../controllers/budgetController");
const verifyToken = require("../config/middleware");

// Route: GET /api/budget
// Description: Get user's budget
router.get("/", verifyToken, budgetController.getUserBudget);

// Route: POST /api/budget
// Description: Update user's budget
router.post("/", verifyToken, budgetController.updateUserBudget);

module.exports = router;
