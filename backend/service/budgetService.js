// budgetService.js

const Budget = require("../models/Budget");

// Function to get user's budget
async function getUserBudget(userId) {
  try {
    const budget = await Budget.findOne({ user: userId });
    return budget;
  } catch (err) {
    console.error(err.message);
    throw new Error("Server Error");
  }
}

// Function to update user's budget
async function updateUserBudget(categories, userId) {
  try {
    let budget = await Budget.findOne({ user: userId });

    if (!budget) {
      // Create new budget if not exists
      budget = new Budget({
        user: userId,
        categories,
      });

      await budget.save();
      return budget;
    }

    // Update existing budget
    budget.categories = categories;

    await budget.save();
    return budget;
  } catch (err) {
    console.error(err.message);
    throw new Error("Server Error");
  }
}

module.exports = { getUserBudget, updateUserBudget };
