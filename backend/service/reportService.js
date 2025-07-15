// reportService.js

const Expense = require("../models/Expense");
const Budget = require("../models/Budget");

// Function to generate expense report
async function generateExpenseReport(userId) {
  try {
    // Get expenses for the user
    const expenses = await Expense.find({
      user: userId,
    });

    // Calculate total expenses
    const totalExpenses = expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    // Get user's budget
    const budget = await Budget.findOne({ user: userId });

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

    return { totalExpenses, remainingBudget };
  } catch (err) {
    console.error(err.message);
    throw new Error("Server Error");
  }
}

module.exports = { generateExpenseReport };
