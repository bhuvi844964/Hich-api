import express from "express";
import { refreshToken } from "../controllers/refreshToken.js";

const router = express.Router();

// Route for creating a token with refresh token
router.post("/", refreshToken);

export default router;
