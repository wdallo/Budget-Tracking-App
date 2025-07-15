// reportController.js

const Expense = require("../models/expense");
const Budget = require("../models/budget");

// Controller function to generate expense report
async function generateExpenseReport(req, res) {
  try {
    // Get expenses for the authenticated user
    const expenses = await Expense.find({
      user: req.user.id,
    });

    // Calculate total expenses
    const totalExpenses = expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    // Get user's budget
    const budget = await Budget.findOne({
      user: req.user.id,
    });

    // Calculate remaining budget
    let remainingBudget = 0;
    if (budget) {
      const { categories } = budget;
      const budgetAmounts = categories.map((category) => category.amount);
      const totalBudget = budgetAmounts.reduce(
        (total, amount) => total + amount,
        0
      );
      remainingBudget = totalBudget - totalExpenses;
    }

    res.json({
      totalExpenses,
      remainingBudget,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

module.exports = { generateExpenseReport };
