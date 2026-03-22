const { Book } = require("./models/Book");
const { books, authors } = require("./data");
const connectToDb = require("./config/db");
require("dotenv").config();

connectToDb();

const importBooks = async () => {
  try {
    await Book.insertMany(books);
    console.log("Books Imported ✅");
    process.exit(); 
  } catch (error) {
    console.log(error);
    process.exit(1); 
  }
};

const importAuthors = async () => {
  try {
    await Authors.insertMany(authors);
    console.log("Authors Imported ✅");
    process.exit(); 
  } catch (error) {
    console.log(error);
    process.exit(1); 
  }
};
const removeAuthors = async () => {
  try {
    await Author.deleteMany();
    console.log("Authors Removed 🗑️");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const removeBooks = async () => {
  try {
    await Book.deleteMany(); // يفضل حذف الكل بدون تمرير المصفوفة
    console.log("Books Removed 🗑️");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// فحص الأرجومنت من الـ Terminal
if (process.argv[2] === "-import-books") {
  importBooks();
} else if (process.argv[2] === "-remove") {
  removeBooks();
}

if (process.argv[2] === "-import") {
  importAuthors();
} else if (process.argv[2] === "-remove") {
  removeAuthors();
}
