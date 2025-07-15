// expenseController.js

const Expense = require("../models/expense");

// Controller function to get all expenses
async function getAllExpenses(req, res) {
  try {
    const expenses = await Expense.find({
      user: req.user.id,
    }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

// Controller function to add a new expense
async function addExpense(req, res) {
  const { amount, category, description } = req.body;

  try {
    const newExpense = new Expense({
      amount,
      category,
      description,
      user: req.user.id,
    });

    const expense = await newExpense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

// Controller function to delete an expense
async function deleteExpense(req, res) {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        msg: "Expense not found",
      });
    }

    // Check if user owns the expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: "Not authorized",
      });
    }

    await expense.remove();
    res.json({ msg: "Expense removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

module.exports = { getAllExpenses, addExpense, deleteExpense };
