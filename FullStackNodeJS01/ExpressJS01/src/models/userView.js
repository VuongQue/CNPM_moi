// models/userView.js
const mongoose = require("mongoose");

const userViewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  viewedAt: { type: Date, default: Date.now }
});
userViewSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("UserView", userViewSchema);
