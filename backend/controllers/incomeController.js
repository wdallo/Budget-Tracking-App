// incomeController.js

const Income = require("../models/income");

// Controller function to get all incomes
async function getAllIncomes(req, res) {
  try {
    const incomes = await Income.find({
      user: req.user.id,
    }).sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

// Controller function to add a new income
async function addIncome(req, res) {
  const { amount, description } = req.body;

  try {
    // Use req.user.id to attach user ID to the income object
    const newIncome = new Income({
      amount,
      description,
      user: req.user.id, // Attach user ID to the income object
    });

    const income = await newIncome.save();
    res.status(201).json(income);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

// Controller function to delete an income
async function deleteIncome(req, res) {
  try {
    let income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({
        msg: "Income not found",
      });
    }

    // Check if user owns the income
    if (income.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: "Not authorized",
      });
    }

    await income.remove();
    res.json({ msg: "Income removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

module.exports = { getAllIncomes, addIncome, deleteIncome };
