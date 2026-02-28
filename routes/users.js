// models/User.js
const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenandAdmin,
} = require("../middlewares/verifyToken");
/**
 * @desc    Update User
 * @route   /api/user/:id
 * @method  PUT
 * @access private
 */

router.put(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).json({});
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          password: req.body.password,
          username: req.body.username,
        },
      },
      { new: true },
    ).select("-password");
    res.status(200).json(updatedUser);
  }),
);

/**
 * @desc    Get all  Users
 * @route   /api/user/
 * @method  Get
 * @access private
 */

router.get(
  "/",
  verifyTokenandAdmin,
  asyncHandler(async (req, res) => {
    const user = await User.find().select("-password");
    res.status(200).json(updatedUser);
  }),
);

/**
 * @desc    Get Users by id
 * @route   /api/user/:id
 * @method  Get
 * @access private(only admin & user himeslf)
 */

router.get(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  }),
);

/**
 * @desc    delete Users
 * @route   /api/user/:id
 * @method  Delete
 * @access private(only admin & user himeslf)
 */

router.get(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "user has been deleted successfully " });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  }),
);

function validateUpdateUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    username: Joi.string().trim().min(2).max(100).required(),
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
}
// verifyTokenAndAuthorization
module.exports = {
  User,
  validateUpdateUser,
};
