import express from "express";
const router = express.Router();
import { login, logout, signup, me } from "../controllers/authControllers.js";

router.post("/login", login);
router.post("/register", signup);
router.post("/logout", logout);
router.get("/me", me);

export default router;