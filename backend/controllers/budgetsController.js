const Budget = require("../models/Budget.js");

const getBudgets = async (req, res) => {
  try {
    // Assumes req.user._id is set by authentication middleware
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBudget = async (req, res) => {
  try {
    // Assumes req.user._id is set by authentication middleware
    const budget = new Budget({ ...req.body, user: req.user._id });
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteBudget = async (req, res) => {
  try {
    // Ensure the budget belongs to the authenticated user
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!budget) {
      return res
        .status(404)
        .json({ error: "Budget not found or not authorized" });
    }
    await budget.deleteOne();
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    // Find the budget and ensure it belongs to the user
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!budget) {
      return res
        .status(404)
        .json({ error: "Budget not found or not authorized" });
    }
    // Update only if user owns the budget
    Object.assign(budget, req.body);
    await budget.save();
    res.json(budget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget };
