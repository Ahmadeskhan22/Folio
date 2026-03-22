// models/User.js
const express = require("express");
const router = express.Router();

const {
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../controller/userController");
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

// /api/users
router.get("/", verifyTokenandAdmin, getAllUsers);

// /api/users/:id
router
  .route("/:id")
  .put(verifyTokenAndAuthorization, updateUser)
  .get(verifyTokenAndAuthorization, getUserById)
  .delete(verifyTokenAndAuthorization, deleteUser);

module.exports = router;
