const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

// الاستيراد الصحيح والوحيد للموديل والدوال
const {
  Author,
  validateCreateAuthor,
  validateUpdateInfoAuthor,
} = require("../models/Author");

// GET: جلب كل المؤلفين من قاعدة البيانات
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const authorsList = await Author.find();
    res.status(200).json(authorsList);
  }),
);

// POST: إنشاء مؤلف جديد
router.post(
  "/",
  asyncHandler(async (req, res) => {
    // التحقق من البيانات المرسلة
    const { error } = validateCreateAuthor(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const author = new Author({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      nationality: req.body.nationality,
      image: req.body.image,
    });

    const result = await author.save(); // الحفظ الفعلي في MongoDB
    res.status(201).json(result);
  }),
);

// PUT: تحديث بيانات مؤلف
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateInfoAuthor(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const author = await Author.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          nationality: req.body.nationality,
          image: req.body.image,
        },
      },
      { new: true }, // ليرجع السجل الجديد بعد التعديل
    );

    if (!author) {
      return res.status(404).json({ message: "author not found" });
    }
    res.status(200).json(author);
  }),
);

// DELETE: حذف مؤلف
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (author) {
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "author has been deleted" });
    } else {
      res.status(404).json({ message: "author not found" });
    }
  }),
);

module.exports = router;
