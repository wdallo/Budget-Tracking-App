// budgetController.js

const Budget = require("../models/budget");

// Controller function to get user's budget
async function getUserBudget(req, res) {
  try {
    const budget = await Budget.findOne({
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        msg: "Budget not found",
      });
    }

    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

// Controller function to update user's budget
async function updateUserBudget(req, res) {
  const { categories } = req.body;

  try {
    let budget = await Budget.findOne({
      user: req.user.id,
    });

    if (!budget) {
      // Create new budget if not exists
      budget = new Budget({
        user: req.user.id,
        categories,
      });

      await budget.save();
      return res.status(201).json(budget);
    }

    // Update existing budget
    budget.categories = categories;

    await budget.save();
    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

module.exports = { getUserBudget, updateUserBudget };
