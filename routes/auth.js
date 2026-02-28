const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { model } = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const bcrypt = require("bcryptjs");
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

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    let user = await User.findOne({ email: req.email });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });
    const result = await user.save();
    const token = user.generateToken();

    const { password, ...other } = result._doc;
    res.status(201).json(result);
  }),
);

/**
 * @desc    Login user
 * @route   /api/auth/login
 * @method  POST
 */

router.post(
  "/login",
  asyncHandler(async (req, res) => {
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
  }),
);

module.exports = router;
