const express = require("express");
const router = express.Router();
const { validateCreateBook, validateUpdateBook } = require("../models/Book");
const books = [
  {
    id: 1,
    title: "Black Swan",
    author: "Ajmf", // تم تعديل الإملاء
    description: "About Black Swan", // تم تعديل الإملاء
    price: 10,
    cover: "Soft cover",
  },

  {
    id: 2,
    title: "Black Swan",
    author: "Ajmf", // تم تعديل الإملاء
    description: "About Black Swan", // تم تعديل الإملاء
    price: 10,
    cover: "Soft cover",
  },
  // {
  //   id: 3,
  //   title: "Black Swan",
  //   author: "Ajmf", // تم تعديل الإملاء
  //   description: "About Black Swan", // تم تعديل الإملاء
  //   price: 10,
  //   cover: "Soft cover",
  // },
];

router.get("/", (req, res) => {
  res.send("Hello, Ahmad Eskhan"); // [cite: 1]
});

/**
 * @desc Get all books
 * @route  /api/books/:id
 * @method GET
 * @access public
 *
 *
 */

router.get("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "book not found" });
  }
});
/**
 * @desc Get all books
 * @route  /api/books
 * @method POST
 * @access public
 *
 *
 */

router.post("/", (req, res) => {
  const { error } = validateCreateBook(req.body);

  if (error) {
    return res.status(400).json({ message: error.details });
  }

  const book = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    price: req.body.price,
    cover: req.body.cover,
  };

  books.push(book);
  res.status(201).json(book);
});

//validate create Book

//to update data
/**
 * @desc update   books
 * @route  /api/books
 * @method PUT
 * @access public
 *
 *
 */

router.put("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id)); // to find a book in array
  const { error } = validateUpdateBook(req.body);
  if (error) {
    res.status(404).json({ message: "book not be update" });
  }

  if (book) {
    res.status(200).json({ message: "Book is succifully updated" });
  } else {
    res.status(404).json({ message: "Book has't been  updated" });
  }
});

//to delete data
/**
 * @desc udelete  books
 * @route  /api/books
 * @method DELETE
 * @access public
 *
 *
 */

router.delete("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (book) {
    res.status(200).json({ message: "Book is  deleted" });
  } else {
    res.status(404).json({ message: "Book is not found" });
  }
});

module.exports = router;
