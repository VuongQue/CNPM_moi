const Product = require("../models/product");

// Tạo sản phẩm
const createProductService = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

// Lấy tất cả sản phẩm (trang chủ)
const getProductsService = async () => {
  return await Product.find();
};

// Lấy sản phẩm theo id
const getProductByIdService = async (id) => {
  return await Product.findById(id);
};

module.exports = {
  createProductService,
  getProductsService,
  getProductByIdService,
};
