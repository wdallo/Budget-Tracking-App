// GET /api/analytics/income-by-category?period=30
const getIncomeByCategory = async (req, res) => {
  try {
    const userId = req.user._id;
    const period = parseInt(req.query.period) || 30;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - period);

    // Aggregate income by category
    const catAgg = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          type: "income",
          date: { $gte: sinceDate },
        },
      },
      { $group: { _id: "$category", amount: { $sum: "$amount" } } },
      { $sort: { amount: -1 } },
    ]);
    const catIds = catAgg
      .map((c) => {
        if (!c._id) return null;
        if (
          typeof c._id === "object" &&
          c._id instanceof mongoose.Types.ObjectId
        ) {
          return c._id;
        }
        if (typeof c._id === "string" || typeof c._id === "number") {
          if (mongoose.Types.ObjectId.isValid(c._id)) {
            return new mongoose.Types.ObjectId(c._id);
          }
        }
        return null;
      })
      .filter(Boolean);
    const categories = await Category.find({ _id: { $in: catIds } });
    const catMap = {};
    categories.forEach((c) => {
      catMap[c._id.toString()] = c;
    });
    const result = catAgg.map((c) => ({
      name: catMap[c._id]?.name || "Unknown",
      color: catMap[c._id]?.color || "#ccc",
      amount: c.amount,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};
const Transaction = require("../models/Transaction.js");
const Category = require("../models/Category.js");
const mongoose = require("mongoose");

// GET /api/analytics/summary?period=30 (period in days)
const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const period = parseInt(req.query.period) || 30;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - period);

    // Fetch transactions for user in period
    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: sinceDate },
    });

    let totalIncome = 0;
    let totalExpenses = 0;
    let monthlyTrend = [];
    let categoryBreakdown = [];

    // Calculate totals
    transactions.forEach((t) => {
      if (t.type === "income") totalIncome += t.amount;
      else if (t.type === "expense") totalExpenses += t.amount;
    });

    // Monthly trend (group by month)
    const trendMap = {};
    transactions.forEach((t) => {
      const month = t.date.getFullYear() + "-" + (t.date.getMonth() + 1);
      if (!trendMap[month]) trendMap[month] = { income: 0, expenses: 0 };
      if (t.type === "income") trendMap[month].income += t.amount;
      else if (t.type === "expense") trendMap[month].expenses += t.amount;
    });
    monthlyTrend = Object.entries(trendMap).map(([month, vals]) => ({
      month,
      ...vals,
    }));

    // Category breakdown (for expenses)
    const catAgg = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          type: "expense",
          date: { $gte: sinceDate },
        },
      },
      { $group: { _id: "$category", amount: { $sum: "$amount" } } },
      { $sort: { amount: -1 } },
    ]);
    console.log("catAgg (summary):", catAgg); // DEBUG
    // Get category names/colors
    const catIds = catAgg
      .map((c) => {
        if (!c._id) return null;
        if (
          typeof c._id === "object" &&
          c._id instanceof mongoose.Types.ObjectId
        ) {
          return c._id;
        }
        if (typeof c._id === "string" || typeof c._id === "number") {
          if (mongoose.Types.ObjectId.isValid(c._id)) {
            return new mongoose.Types.ObjectId(c._id);
          }
        }
        return null;
      })
      .filter(Boolean);
    console.log("catAgg:", catAgg); // DEBUG
    console.log("catIds:", catIds); // DEBUG
    const categories = await Category.find({ _id: { $in: catIds } });
    const catMap = {};
    categories.forEach((c) => {
      catMap[c._id.toString()] = c;
    });
    categoryBreakdown = catAgg.map((c) => ({
      category: catMap[c._id]?.name || "Unknown",
      color: catMap[c._id]?.color || "#ccc",
      amount: c.amount,
    }));

    res.json({
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      monthlyTrend,
      categoryBreakdown,
      transactionCount: transactions.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

// GET /api/analytics/spending-by-category?period=30
const getSpendingByCategory = async (req, res) => {
  try {
    const userId = req.user._id;
    const period = parseInt(req.query.period) || 30;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - period);

    // Aggregate spending by category for expenses
    const catAgg = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          type: "expense",
          date: { $gte: sinceDate },
        },
      },
      { $group: { _id: "$category", amount: { $sum: "$amount" } } },
      { $sort: { amount: -1 } },
    ]);
    console.log("catAgg (spending-by-category):", catAgg); // DEBUG
    // Get category names/colors
    const catIds = catAgg
      .map((c) => {
        if (!c._id) return null;
        if (
          typeof c._id === "object" &&
          c._id instanceof mongoose.Types.ObjectId
        ) {
          return c._id;
        }
        if (typeof c._id === "string" || typeof c._id === "number") {
          if (mongoose.Types.ObjectId.isValid(c._id)) {
            return new mongoose.Types.ObjectId(c._id);
          }
        }
        return null;
      })
      .filter(Boolean);
    console.log("catAgg:", catAgg); // DEBUG
    console.log("catIds:", catIds); // DEBUG
    const categories = await Category.find({ _id: { $in: catIds } });
    const catMap = {};
    categories.forEach((c) => {
      catMap[c._id.toString()] = c;
    });
    const result = catAgg.map((c) => ({
      name: catMap[c._id]?.name || "Unknown",
      color: catMap[c._id]?.color || "#ccc",
      amount: c.amount,
    }));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

module.exports = { getSummary, getSpendingByCategory, getIncomeByCategory };
