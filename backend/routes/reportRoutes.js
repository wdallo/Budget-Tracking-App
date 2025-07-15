// reportRoutes.js

const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const verifyToken = require("../config/middleware");

// Route: GET /api/report/expense
// Description: Generate expense report
router.get("/expense", verifyToken, reportController.generateExpenseReport);

module.exports = router;
