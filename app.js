const express = require("express");
const app = express();
app.use(express.json());

const mongoose = require("mongoose");
const booksPath = require("./routes/books");
const authorsPath = require("./routes/authors"); // Middleware

//connection to database

mongoose;
mongoose
  .connect("mongodb://127.0.0.1:27017/bookStoreDB")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((error) => console.log("Connection Failed to MongoDB...", error));

// Routes
app.use("/api/books", booksPath);
app.use("/api/authors", authorsPath);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
