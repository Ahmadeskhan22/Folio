const express = require("express");
//init App

const app = express();
const books = [
  {
    id: 1,
    title: "Black  Swan ",
    autho: "Ajmf",
    descripiton: "About Black Swan",
    price: 10,
    cover: "Soft cover",
  },
  {
    id: 2,
    title: "Black  Swan ",
    autho: "fdf",
    descripiton: "gfgfAbout Black Swan",
    price: 1022,
    cover: "hhg cover",
  },
];

// app.post();
// app.put();
// app.delete();

app.get("/api/books/:id", function (req, res) {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "book not found" });
  }
});

app.get("/", function (req, res) {
  res.send("Hrllow, ms.eskhan");
});
//Running the Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
