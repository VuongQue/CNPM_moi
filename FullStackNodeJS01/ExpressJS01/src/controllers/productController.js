const Product = require("../models/product");
const esClient = require("../config/elasticsearch");
const Favorite = require("../models/favorite");
const UserView = require("../models/userView");

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

// Thêm sản phẩm vào yêu thích
const addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;       // có được từ middleware auth
    const productId = req.params.id;   // lấy productId từ URL

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing userId or productId" });
    }

    const fav = await Favorite.findOneAndUpdate(
      { userId, productId },
      { userId, productId },
      { upsert: true, new: true }
    );

    res.json(fav);
  } catch (err) {
    console.error("addFavorite error:", err);
    res.status(500).json({ message: err.message });
  }
};


// Lấy danh sách sản phẩm yêu thích của user
const getFavorites = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }
    const userId = req.user._id;
    const favs = await Favorite.find({ userId }).populate("productId");
    return res.json(favs.map(f => f.productId));
  } catch (err) {
    console.error("getFavorites error:", err);
    return res.status(500).json({ message: err.message });
  }
};



const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Not found" });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(6);


    res.json(related);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addView = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;
  await UserView.findOneAndUpdate(
    { userId, productId },
    { viewedAt: new Date() },
    { upsert: true }
  );
  res.json({ message: "View recorded" });
};

const getRecentViews = async (req, res) => {
  const userId = req.user._id;
  const views = await UserView.find({ userId })
    .sort({ viewedAt: -1 })
    .limit(10)
    .populate("productId");
  res.json(views.map(v => v.productId));
};


module.exports = {
  createProduct,
  getProducts,
  getProductById,
  searchProductsES,
  addFavorite,
  getFavorites,
  getRelatedProducts,
  addView,
  getRecentViews
};
