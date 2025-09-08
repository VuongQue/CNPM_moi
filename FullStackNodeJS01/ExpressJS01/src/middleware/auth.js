const jwt = require("jsonwebtoken");

const white_lists = [
  "/v1/api/register",
  "/v1/api/login",
  "/v1/api/products",
  "/v1/api/products/search",
  "/v1/api/categories",
  "/v1/api/search",
];

const auth = (req, res, next) => {
  // Cho phép tất cả path bắt đầu bằng trong white_lists
  if (white_lists.some(path => req.originalUrl.startsWith(path))) {
    return next();
  }

  const token = req.headers?.authorization?.split(" ")?.[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        email: decoded.email,
        name: decoded.name,
        createdBy: "hoidanit"
      };
      console.log(">>> check token: ", decoded);
      return next();
    } catch (error) {
      return res.status(401).json({
        message: "Token bị hết hạn/hoặc không hợp lệ"
      });
    }
  } else {
    return res.status(401).json({
      message: "Bạn chưa truyền Access Token ở header/Hoặc token bị hết hạn"
    });
  }
};

module.exports = auth;
