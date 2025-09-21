// models/comment.js
const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  content: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Comment", commentSchema);