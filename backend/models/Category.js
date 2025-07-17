// Category model
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  color: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
