// التصحيح: نستخدم module وليس model
const logger = (req, res, next) => {
  // استخدم الـ Backticks (`) وليس Single Quote (') عشان الـ Template Literals تشتغل
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`,
  );
  next(); // مهم جداً عشان الطلب يكمل وما يضل معلق
};

module.exports = logger;
