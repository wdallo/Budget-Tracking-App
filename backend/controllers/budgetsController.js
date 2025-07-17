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

module.exports = { getBudgets, createBudget };
