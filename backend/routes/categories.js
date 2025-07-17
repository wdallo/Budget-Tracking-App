const express = require("express");

const requireAuth = require("../middleware/authMiddleware.js");
const {
  getCategories,
  createCategory,
} = require("../controllers/categoriesController.js");

const router = express.Router();

// Get all categories (protected)
router.get("/", requireAuth, getCategories);

// Create category (protected)
router.post("/", requireAuth, createCategory);

// TODO: Add update, delete, and other routes using controller

module.exports = router;
