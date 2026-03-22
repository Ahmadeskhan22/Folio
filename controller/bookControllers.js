const asyncHandler = require("express-async-handler");
const { validateCreateBook, validateUpdateBook, Book } = require("../models/Book");

/**
 * @desc    Get all books
 * @route   GET /api/books
 * @access  Public
 */
const getAllbooks = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  // ✅ Bug 1 — if no query params provided, return ALL books
  //    Old code: { price: { $gte: undefined, $lte: undefined } } → returns nothing
  const filter = {};
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const books = await Book.find(filter).populate("author", ["_id", "firstname", "lastname"]);
  res.status(200).json(books);
});

/**
 * @desc    Get book by ID
 * @route   GET /api/books/:id
 * @access  Public
 */
const getbookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate("author");
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

/**
 * @desc    Add new book
 * @route   POST /api/books
 * @access  Private (admin)
 */
const AddBooks = asyncHandler(async (req, res) => {
  const { error } = validateCreateBook(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const book = new Book({
    title:       req.body.title,
    author:      req.body.author,
    description: req.body.description,
    price:       req.body.price,
    cover:       req.body.cover,
  });

  const result = await book.save();
  res.status(201).json(result); // ✅ Bug 2 — was returning `book` before save, now returns `result`
});

/**
 * @desc    Update book
 * @route   PUT /api/books/:id
 * @access  Private (admin)
 */
const UpdateBook = asyncHandler(async (req, res) => {
  const { error } = validateUpdateBook(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
    // ✅ Bug 3 — missing `return` caused crash (code kept running after response)
    // ✅ Bug 3 — wrong status 404 for validation, should be 400
  }

  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title:       req.body.title,
        author:      req.body.author,
        description: req.body.description,
        price:       req.body.price,
        cover:       req.body.cover,
      },
    },
    { new: true }
  );

  // ✅ Bug 4 — no check if book exists, would crash with null response
  if (!updatedBook) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.status(200).json(updatedBook);
});

/**
 * @desc    Delete book
 * @route   DELETE /api/books/:id
 * @access  Private (admin)
 */
const DeleteBooks = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book deleted successfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports = { getAllbooks, getbookById, AddBooks, DeleteBooks, UpdateBook };