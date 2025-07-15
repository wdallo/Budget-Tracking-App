// income.js

const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Income = mongoose.model("Income", IncomeSchema);

module.exports = Income;
