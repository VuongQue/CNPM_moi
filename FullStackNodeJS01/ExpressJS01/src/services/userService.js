require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const createUserService = async (name, email, password) => {
  try {
    // check user exist
    const user = await User.findOne({ email });
    if (user) {
      console.log(`>>> user exist, chọn 1 email khác: ${email}`);
      return null;
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // save user
    let result = await User.create({
      name,
      email,
      password: hashPassword,
      role: "User"
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const loginService = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { EC: 1, EM: "Email/Password không hợp lệ" };
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return { EC: 2, EM: "Email/Password không hợp lệ" };
    }

    // ✅ payload phải có _id
    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return {
      EC: 0,
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserService = async () => {
  try {
    let result = await User.find({}).select("-password");
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService
};
