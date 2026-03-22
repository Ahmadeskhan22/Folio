const express = require("express");
const router = express.Router(); // ✅ صح (R كبيرة)
const asyncHandler = require("express-async-handler");
const { verifyTokenandAdmin } = require("../middlewares/verifyToken");

// الاستيراد الصحيح والوحيد للموديل والدوال
const {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controller/authorController");

// /api/authors
router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.post("/", createAuthor);
router.put("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);
module.exports = router;
