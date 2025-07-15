// budget.js

const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true
  },
  categories: [
    {
      name: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Budget = mongoose.model("Budget", BudgetSchema);

module.exports = Budget;
