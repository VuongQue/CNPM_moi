// scripts/reindex.js
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/product");
const esClient = require("../config/elasticsearch");

(async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_DB_URL);
    await esClient.ping();
    console.log("✅ Kết nối Elasticsearch thành công");


    // Lấy toàn bộ sản phẩm
    const products = await Product.find();

    // Xoá index cũ (nếu có) và tạo mới
    await esClient.indices.delete({ index: "products" }, { ignore: [404] });
    await esClient.indices.create({ index: "products" });

    // Index lại từng product
    for (let product of products) {
      await esClient.index({
        index: "products",
        id: product._id.toString(),
        document: {
          productName: product.productName,
          categoryId: product.categoryId,
          price: product.price,
          description: product.description,
        },
      });
    }

    console.log(`Reindex thành công: ${products.length} sản phẩm.`);
    process.exit(0);
  } catch (err) {
    console.error("Reindex error:", err);
    process.exit(1);
  }
})();
