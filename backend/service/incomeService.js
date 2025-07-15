// incomeService.js

const Income = require("../models/Income");

// Function to get all incomes for a user
async function getAllIncomes(userId) {
  try {
    const incomes = await Income.find({ user: userId }).sort({ date: -1 });
    return incomes;
  } catch (err) {
    console.error(err.message);
    throw new Error("Server Error");
  }
}

// Function to add a new income
async function addIncome(amount, description, userId) {
  try {
    const newIncome = new Income({
      amount,
      description,
      user: userId,
    });

    const income = await newIncome.save();
    return income;
  } catch (err) {
    console.error(err.message);
    throw new Error("Server Error");
  }
}

// Function to delete an income
async function deleteIncome(incomeId, userId) {
  try {
    let income = await Income.findById(incomeId);

    if (!income) {
      throw new Error("Income not found");
    }

    // Check if user owns the income
    if (income.user.toString() !== userId) {
      throw new Error("Not authorized");
    }

    await income.remove();
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

module.exports = { getAllIncomes, addIncome, deleteIncome };
