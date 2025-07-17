const Transaction = require("../models/Transaction.js");

const getTransactions = async (req, res) => {
  try {
    // Only return transactions for the logged-in user
    const transactions = await Transaction.find({
      user: req.user._id,
    }).populate("category");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    // Always set user field from req.user
    const transaction = new Transaction({ ...req.body, user: req.user._id });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete transaction by ID (only if it belongs to the user)
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTransactions, createTransaction, deleteTransaction };
