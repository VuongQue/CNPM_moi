// scripts/reindex.js
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/product");
const esClient = require("../config/elasticsearch");

(async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("✅ Kết nối MongoDB thành công");

    // Ping Elasticsearch
    await esClient.ping();
    console.log("✅ Kết nối Elasticsearch thành công");

    // Xóa index cũ nếu có
    const indexName = "products";
    const exists = await esClient.indices.exists({ index: indexName });
    if (exists) {
      await esClient.indices.delete({ index: indexName });
      console.log("🗑️ Đã xóa index cũ:", indexName);
    }

    // Tạo lại index (có thể định nghĩa mapping)
    await esClient.indices.create({
      index: indexName,
      body: {
        mappings: {
          properties: {
            productName: { type: "text" },
            category: { type: "text" },
            price: { type: "float" },
            description: { type: "text" },
          },
        },
      },
    });
    console.log("📦 Đã tạo index mới:", indexName);

    // Lấy toàn bộ sản phẩm từ MongoDB
    const products = await Product.find();
    console.log(`🔎 Tìm thấy ${products.length} sản phẩm trong MongoDB`);

    // Index lại sản phẩm
    for (let product of products) {
        console.log(product._id, product.name, product.categoryId);
      await esClient.index({
        index: indexName,
        id: product._id.toString(),
        document: {
          productName: product.productName,
          category: product.category,
          price: product.price,
          description: product.description,
        },
      });
    }

    // Refresh để dữ liệu query ra được ngay
    await esClient.indices.refresh({ index: indexName });

    console.log(`✅ Reindex thành công: ${products.length} sản phẩm.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Reindex error:", err);
    process.exit(1);
  }
})();
