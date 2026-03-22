const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { verifyTokenandAdmin } = require("../middlewares/verifyToken");
const {
  getAllbooks,
  getbookById,
  AddBooks,
  DeleteBooks,
  UpdateBook,
} = require("../controller/bookControllers");
const {
  validateCreateBook,
  validateUpdateBook,
  Book,
} = require("../models/Book");
/*
Operator
Description
$eq

Matches values equal to a specified value.

$gt

Matches values greater than a specified value.

$gte

Matches values greater than or equal to a specified value.

$in

Matches any values specified in an array.

$lt

Matches values less than a specified value.

$lte

Matches values less than or equal to a specified value.

$ne

Matches all values not equal to a specified value.

$nin

Matches if the value is not equal to any of a given list of values.


*/
router.get("/", getAllbooks);

router.get("/:id", getbookById);

router.post("/", verifyTokenandAdmin, AddBooks);

router.put("/:id", verifyTokenandAdmin, UpdateBook);

router.delete("/:id", verifyTokenandAdmin,DeleteBooks);

module.exports = router;
