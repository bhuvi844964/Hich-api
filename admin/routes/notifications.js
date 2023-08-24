import express from "express";
import {
  sendNotification,
  getNotifications,
  getNotificationsByUser,
  deleteNotifications,
} from "../controllers/notificationController.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route for creating a new product
router.post("/", authenticateToken, authorizeRole("admin"), sendNotification);

router.get("/", authenticateToken, getNotifications);
router.get(
  "/:userId",
  authenticateToken,
  authorizeRole("user"),
  getNotificationsByUser
);
router.delete(
  "/:userId",
  authenticateToken,
  authorizeRole("admin"),
  deleteNotifications
);

export default router;
