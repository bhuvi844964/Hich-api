import express from "express";
import { scanQRCode } from "../controllers/scanQRCodeController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Scan QRCode
router.post("/", authenticateToken, scanQRCode);

export default router;
