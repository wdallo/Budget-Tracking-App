const Category = require("../models/Category.js");

const getCategories = async (req, res) => {
  try {
    // Only return categories for the logged-in user
    const categories = await Category.find({ user: req.user._id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    // Always set user field from req.user
    const category = new Category({ ...req.body, user: req.user._id });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getCategories, createCategory };
