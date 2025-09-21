// src/routes/api.js
const express = require("express");
const { createUser, handleLogin, getUser, getAccount } = require("../controllers/userController");
const auth = require("../middleware/auth");
const delay = require("../middleware/delay");
const productRoutes = require("./productRoutes");

const routerAPI = express.Router();

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

// Các route user cần token
routerAPI.get("/user", auth, getUser);
routerAPI.get("/account", auth, delay, getAccount);

// Product routes (bản thân nó tự gắn auth ở endpoint cần)
routerAPI.use("/", productRoutes);

routerAPI.get("/", (req, res) => res.status(200).json("Hello world api"));

module.exports = routerAPI;
