const asyncHandler = require("express-async-handler");
const { model } = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const passwordComplexity = require("joi-password-complexity");

const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");

/**
 * @desc    Register new user
 * @route   /api/auth/register
 * @method  POST
 */
const RegisterAuth = asyncHandler(async (req, res) => {
  // 1. Validate
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // 2. Check duplicate email
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  // 3. Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // 4. Create user — ✅ add firstName & lastName
  const user = new User({
    email:     req.body.email,
    firstName: req.body.firstName,  // ✅ was missing
    lastName:  req.body.lastName,   // ✅ was missing
    password:  hashedPassword,
  });

  const result = await user.save();
  const token = user.generateToken();
  const { password, ...other } = result._doc;

  res.status(201).json({ ...other, token });
});

/**
 * @desc    Login user
 * @route   /api/auth/login
 * @method  POST
 */

const LoginAuth = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordMatched = await bcrypt.compare(
    req.body.password,
    user.password,
  );
  //compare  between two password --p1 from user , p2 from database
  if (!isPasswordMatched) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const token = user.generateToken();
  const { password, ...other } = user._doc;

  res.status(200).json({ ...other, token });
});

module.exports = { LoginAuth, RegisterAuth };
