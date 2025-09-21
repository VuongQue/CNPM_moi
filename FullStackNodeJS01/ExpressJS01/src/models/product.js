const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stockQuantity: { type: Number, default: 0 },
  category: { type: String }, // có thể lưu ID của category
  tags: [{ type: String }],
  images: [{ type: String }], // danh sách URL ảnh
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
