const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { verifyTokenandAdmin } = require("../middlewares/verifyToken");

const {
  validateCreateBook,
  validateUpdateBook,
  Book,
} = require("../models/Book");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.find().populate("author", [
      "_id",
      "firstname",
      "lastname",
    ]);
    res.status(200).json(books);
  }),
);

/**
 * @desc Get all books by id
 * @route  /api/books/:id
 * @method GET
 * @access public
 *
 *
 */

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate("author");
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "book not found" });
    }
  }),
);
/**
 * @desc Get all books
 * @route  /api/books
 * @method POST
 * @access public
 *
 *
 */

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateCreateBook(req.body);

    if (error) {
      return res.status(400).json({ message: error.details });
    }

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      cover: req.body.cover,
    });
    const result = await book.save();
    res.status(201).json(book);
  }),
);

//validate create Book

//to update data
/**
 * @desc update   books
 * @route  /api/books
 * @method PUT
 * @access private (only admin)
 *
 *
 */

router.put(
  "/:id",
  verifyTokenandAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateBook(req.body);
    if (error) {
      res.status(404).json({ message: "book not be update" });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
          description: req.body.description,
          price: req.body.price,
          cover: req.body.cover,
        },
      },
      { new: true },
    );
    res.status(200).json(updatedBook);
  }),
);

//to delete data
/**
 * @desc udelete  books
 * @route  /api/books
 * @method DELETE
 * @access private (only admin)
 *
 *
 */

router.delete(
  "/:id",
  verifyTokenandAdmin,

  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (book) {
      await Book.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Book is  deleted" });
    } else {
      res.status(404).json({ message: "Book is not found" });
    }
  }),
);

module.exports = router;
