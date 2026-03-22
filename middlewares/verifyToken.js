const jwt = require("jsonwebtoken");

// ✅ Bug 1 — token is usually sent as "Authorization: Bearer <token>"
//    not as a custom "token" header
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; // extract token after "Bearer "
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" }); // ✅ .status not .states
    }
  } else {
    return res.status(401).json({ message: "No token provided" }); // ✅ .status not .states
  }
}

function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "You are not allowed" }); // ✅ .status not .states
    }
  });
}

function verifyTokenandAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "You are not allowed" }); // ✅ .status not .states
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenandAdmin,
};