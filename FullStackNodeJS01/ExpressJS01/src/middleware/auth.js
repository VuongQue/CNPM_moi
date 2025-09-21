// src/middleware/auth.js
const jwt = require("jsonwebtoken");

// Chỉ public đúng các route này
const WHITE_LIST = [
  { method: "POST", regex: /^\/v1\/api\/register$/ },
  { method: "POST", regex: /^\/v1\/api\/login$/ },

  // Product public:
  { method: "GET",  regex: /^\/v1\/api\/products$/ },                 // list
  { method: "GET",  regex: /^\/v1\/api\/products\/search/ },          // search
  { method: "GET",  regex: /^\/v1\/api\/products\/[a-f0-9]{24}$/ },   // detail by ObjectId (24 hex)

  // Others public (nếu có)
  { method: "GET",  regex: /^\/v1\/api\/categories/ },
  { method: "GET",  regex: /^\/v1\/api\/search/ },
];

module.exports = (req, res, next) => {
  console.log("[AUTH] %s %s", req.method, req.originalUrl);

  const isPublic = WHITE_LIST.some(
    it => req.method === it.method && it.regex.test(req.originalUrl)
  );
  if (isPublic) {
    console.log("[AUTH] -> BYPASS (whitelist)");
    return next();
  }

  const token = req.headers?.authorization?.split(" ")?.[1];
  console.log("[AUTH] token(received):", token ? "(present)" : "(missing)");
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("[AUTH] decoded:", decoded);
    return next();
  } catch (e) {
    console.error("[AUTH] verify error:", e.message);
    return res.status(401).json({ message: "Token invalid/expired" });
  }
};
