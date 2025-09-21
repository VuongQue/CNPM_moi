// src/routes/productRoutes.js
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  searchProductsES,
  getRelatedProducts,
  addFavorite,
  getFavorites,
  addView,
  getRecentViews,
} = require("../controllers/productController");

// PUBLIC
router.get("/products/search", searchProductsES);
router.post("/products", createProduct);
router.get("/products", getProducts);

// PROTECTED (phải đi qua auth)
router.post("/products/:id/favorite", auth, addFavorite);
router.get("/products/favorites", auth, getFavorites);
router.post("/products/:id/view", auth, addView);
router.get("/products/views", auth, getRecentViews);

// PUBLIC khác
router.get("/products/:id/related", getRelatedProducts);

// Đặt dynamic :id CUỐI CÙNG để tránh nuốt /favorites
router.get("/products/:id", getProductById);

module.exports = router;
