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
const deleteCategory = async (req, res) => {
  try {
    // Find the category and ensure it belongs to the logged-in user
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!category) {
      return res
        .status(404)
        .json({ error: "Category Not Found or Unauthorized" });
    }
    await Category.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCategories, createCategory, deleteCategory };
