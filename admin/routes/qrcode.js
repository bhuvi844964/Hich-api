// qrcodeRoutes.js

import express from "express";
import {
  createQRCode,
  getQRCodeList,
  getQRCodeById,
  deleteQRCode,
} from "../controllers/qrCodeController.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Generate a new QR code
router.post("/", authenticateToken, authorizeRole("admin"), createQRCode);

// Get all QR codes
router.get("/", authenticateToken, getQRCodeList);

// Get a QR code by ID
router.get("/:qrcodeId", authenticateToken, getQRCodeById);

// Delete a QR code by ID
router.delete(
  "/:qrcodeId",
  authenticateToken,
  authorizeRole("admin"),
  deleteQRCode
);

export default router;
