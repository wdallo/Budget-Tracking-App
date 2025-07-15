// expenseService.js

const Expense = require("../models/Expense");

// Function to get all expenses for a user
async function getAllExpenses(userId) {
  try {
    const expenses = await Expense.find({
      user: userId,
    }).sort({ date: -1 });
    return expenses;
  } catch (err) {
    console.error(err.message);
    throw new Error("Server Error");
  }
}

// Function to add a new expense
async function addExpense(amount, category, description, userId) {
  try {
    const newExpense = new Expense({
      amount,
      category,
      description,
      user: userId,
    });

    const expense = await newExpense.save();
    return expense;
  } catch (err) {
    console.error(err.message);
    throw new Error("Server Error");
  }
}

// Function to delete an expense
async function deleteExpense(expenseId, userId) {
  try {
    let expense = await Expense.findById(expenseId);

    if (!expense) {
      throw new Error("Expense not found");
    }

    // Check if user owns the expense
    if (expense.user.toString() !== userId) {
      throw new Error("Not authorized");
    }

    await expense.remove();
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

module.exports = { getAllExpenses, addExpense, deleteExpense };
