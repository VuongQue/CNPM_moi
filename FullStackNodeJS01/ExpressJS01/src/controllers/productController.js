const Product = require("../models/product");
const esClient = require("../config/elasticsearch");

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy danh sách sản phẩm có phân trang
const getProducts = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;

    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments();

    res.json({
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy sản phẩm theo id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tìm kiếm sản phẩm (ElasticSearch)
const searchProductsES = async (req, res) => {
  try {
    const { q, categoryId, minPrice, maxPrice } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    let mustQuery = [];

    if (q) {
      mustQuery.push({
        match: {
          productName: {
            query: q,
            fuzziness: 1,
          },
        },
      });
    }

    if (categoryId) {
      mustQuery.push({ term: { categoryId: Number(categoryId) } });
    }

    if (minPrice || maxPrice) {
      mustQuery.push({
        range: {
          price: {
            gte: minPrice ? Number(minPrice) : 0,
            lte: maxPrice ? Number(maxPrice) : 999999999,
          },
        },
      });
    }

    const result = await esClient.search({
      index: "products",
      from: (page - 1) * limit,
      size: limit,
      query: { bool: { must: mustQuery } },
    });

    const hits = result.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));

    return res.status(200).json({
      success: true,
      message: "Tìm kiếm thành công",
      totalItems: result.hits.total.value,
      page,
      limit,
      data: hits,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


module.exports = {
  createProduct,
  getProducts,
  getProductById,
  searchProductsES,
};
