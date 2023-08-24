import express from "express";
import {
  getAllRewards,
  getRewardById,
  createReward,
  updateRewardById,
  deleteRewardById,
  uploadImageData,
  getTotalRewardCount,
} from "../controllers/rewardController.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new reward
router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  uploadImageData,
  createReward
);

// Get all rewards
router.get("/", authenticateToken, getAllRewards);

//Total count of rewards
router.get(
  "/count",
  authenticateToken,
  authorizeRole("admin"),
  getTotalRewardCount
);

// Get a specific reward by ID
router.get("/:rewardId", authenticateToken, getRewardById);

// Update a reward by ID
router.put(
  "/:rewardId",
  authenticateToken,
  authorizeRole("admin"),
  uploadImageData,
  updateRewardById
);

// Delete a reward by ID
router.delete(
  "/:rewardId",
  authenticateToken,
  authorizeRole("admin"),
  deleteRewardById
);

export default router;
