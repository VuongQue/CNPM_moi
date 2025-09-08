const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  searchProductsES,
} = require("../controllers/productController");

router.get("/products/search", searchProductsES); 
router.post("/products", createProduct);
router.get("/products", getProducts); // có phân trang ở controller
router.get("/products/:id", getProductById);
module.exports = router;
