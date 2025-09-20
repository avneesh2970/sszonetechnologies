// this is for student
const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  try {
    const token = req.cookies.token; // 🔹 token stored in cookie
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Please login first." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { email, id }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
