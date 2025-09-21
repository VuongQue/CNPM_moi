const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product", 
      required: true 
    }
  },
  { timestamps: true }  // sẽ tự động có createdAt, updatedAt
);

// Ngăn một user favorite trùng 1 sản phẩm nhiều lần
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
