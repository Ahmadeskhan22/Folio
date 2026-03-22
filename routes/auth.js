const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { model } = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { LoginAuth, RegisterAuth } = require("../controller/authControllers");

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

router.post("/register", RegisterAuth);

/**
 * @desc    Login user
 * @route   /api/auth/login
 * @method  POST
 */

router.post("/login", LoginAuth);

module.exports = router;
