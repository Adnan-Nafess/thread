const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.token; // Optional chaining to prevent errors
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized: No token provided!" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decodedToken);
    } catch (err) {
      return res.status(401).json({ msg: "Invalid or expired token!" });
    }

    const user = await User.findById(decodedToken.id) // Ensure correct field
      .populate("followers")
      .populate("threads")
      .populate("replies")
      .populate("reposts");

    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Server error in auth!", error: err.message });
  }
};

module.exports = auth;
