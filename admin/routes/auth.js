import express from "express";
import {
  registerUser,
  loginUser,
  logout,
  //logoutUser,
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Define your authentication routes here

// User registration route
router.post("/register", registerUser);

// User login route
router.post("/login", loginUser);

// User logout route
router.delete("/logout", authenticateToken, logout);

export default router;
