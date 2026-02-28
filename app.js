const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// 1. تحميل الإعدادات (أهم خطوة في البداية)

// 2. استدعاء الميدل وير (تأكد من إملاء اسم المجلدmiddlewares)
const logger = require("./middlewares/logger");
const { notFound, errorHanlder } = require("./middlewares/errors");
const connectToDB = require("./config/db");

// 3. تهيئة التطبيق
const app = express();
app.use(express.json());
app.use(logger);

// 4. الاتصال بقاعدة البيانات
connectToDB();
// 5. المسارات (Routes) - استدعاء مباشر لتجنب أخطاء المتغيرات
app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth")); // تأكد أن الملف اسمه auth.js داخل مجلد routes
app.use("/api/users", require("./routes/users"));
// 6. ميدل وير الأخطاء (يجب أن تكون في النهاية)
app.use(notFound);
app.use(errorHanlder);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  ),
);
