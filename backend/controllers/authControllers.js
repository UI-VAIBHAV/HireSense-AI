import User from "../db/model.js";
import jwt from "jsonwebtoken";

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,           // only send over HTTPS in production
  sameSite: isProd ? "none" : "lax", // "none" needed for cross-site (Vercel <-> API host)
  maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days, matches token expiry below
};

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }

    const user = await User.findOne({ username });

    // Same generic message whether the user doesn't exist or the password
    // is wrong — avoids leaking which usernames are registered
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "invalid username or password" });
    }

    const token = signToken(user._id);
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      message: "login success",
      user: { id: user._id, name: user.name, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logout successful" });
};

export const signup = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "password must be at least 6 characters" });
    }

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      const field = existing.username === username ? "username" : "email";
      return res.status(409).json({ message: `${field} already exists` });
    }

    const user = new User({ name, email, username, password });
    await user.save(); // password gets hashed automatically by the pre-save hook

    const token = signToken(user._id);
    res.cookie("token", token, cookieOptions);
    return res.status(201).json({
      message: "user registered successfully",
      user: { id: user._id, name: user.name, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const me = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};