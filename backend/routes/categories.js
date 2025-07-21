const express = require("express");

const { requireAuth } = require("../middleware/authMiddleware.js");
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require("../controllers/categoriesController.js");

const router = express.Router();

// Get all categories (protected)
router.get("/", requireAuth, getCategories);

// Create category (protected)
router.post("/", requireAuth, createCategory);

// delete category (protected)
router.delete("/:id", requireAuth, deleteCategory);
// TODO: Add update, delete, and other routes using controller

module.exports = router;
