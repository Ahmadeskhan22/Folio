const jwt = require("jsonwebtoken");
const { model } = require("mongoose");
function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      res.states(401).json({ message: "Invalid token" });
    }
  } else {
    res.states(401).json({ message: "no  token provided" });
  }
}
//verify token and auth
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.states(403).json({ message: "You are not allowed" });
    }
  });
}
//verify token and admin

function verifyTokenandAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.states(403).json({ message: "You are not allowed" });
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenandAdmin,
};
