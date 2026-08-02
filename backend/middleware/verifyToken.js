import jwt from "jsonwebtoken";
import User from "../db/model.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Confirm the user still exists (handles deleted accounts / bad tokens)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    req.user = user; // available to downstream route handlers
    next();
  } catch (error) {
    // Covers expired tokens and invalid signatures
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;