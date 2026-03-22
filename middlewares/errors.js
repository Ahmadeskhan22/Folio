// middlewares/errors.js

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHanlder = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    // إظهار مكان الخطأ فقط في مود التطوير
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

// التأكد من التصدير بهذا الشكل (Object)
module.exports = { notFound, errorHanlder };
