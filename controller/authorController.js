const asyncHandler = require("express-async-handler");
const { Author, validateCreateAuthor, validateUpdateAuthor } = require("../models/Author");

// GET all authors
module.exports.getAllAuthors = asyncHandler(async (req, res) => {
  const { pageNumber } = req.query;
  const authorsPerPage = 6;

  // ✅ Bug 1 — if no pageNumber, return ALL authors
  let authorList;
  if (pageNumber) {
    authorList = await Author.find()
      .skip((pageNumber - 1) * authorsPerPage)
      .limit(authorsPerPage);
  } else {
    authorList = await Author.find();  // ← no pagination, return all
  }

  res.status(200).json(authorList);
});

// GET author by ID
module.exports.getAuthorById = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id); // ✅ Bug 2 — use findById

  if (author) {
    res.status(200).json(author);
  } else {
    res.status(404).json({ message: "Author not found" });
  }
});

// POST create author
module.exports.createAuthor = asyncHandler(async (req, res) => {
  const { error } = validateCreateAuthor(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const author = new Author({
    firstname:   req.body.firstname,
    lastname:    req.body.lastname,
    nationality: req.body.nationality,
  });

  const result = await author.save();
  res.status(201).json(result);
});

// PUT update author
module.exports.updateAuthor = asyncHandler(async (req, res) => {
  const { error } = validateUpdateAuthor(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const author = await Author.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        firstname:   req.body.firstname,   // ✅ Bug 3 — lowercase
        lastname:    req.body.lastname,    // ✅ Bug 3 — lowercase
        nationality: req.body.nationality,
      },
    },
    { new: true }
  );

  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }

  res.status(200).json(author);
});

// DELETE author
module.exports.deleteAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (author) {
    await Author.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Author deleted successfully" });
  } else {
    res.status(404).json({ message: "Author not found" });
  }
});