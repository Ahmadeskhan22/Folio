const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
//multer
const storage = multer.diskStorage({
  destination: function (req, fileLoader, cd) {
    cd(null, path, join(__dirname, "../images"));
  },
  filename: function (req, file, cd) {
    cd(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({ storage });

//api//upload
router.post("/", (req, res) => {
  res.status(200).json({ message: "image upload" });
});

module.exports = router;
