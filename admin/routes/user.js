import express from "express";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  blockUnblockUser,
  getTotalUserCount,
} from "../controllers/UserController.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Define routes for user
router.get("/", authenticateToken, authorizeRole("admin"), getAllUsers);
// GET /users/count - Get the total count of users
router.get(
  "/count",
  authenticateToken,
  authorizeRole("admin"),
  getTotalUserCount
);
router.get("/:id", authenticateToken, getUserById);
router.put("/:id", authenticateToken, updateUser);
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeRole("admin"),
  deleteUser
);
// PUT /users/:userId/block - Block Unblock a user
router.put(
  "/:userId/blockUnblockUser",
  authenticateToken,
  authorizeRole("admin"),
  blockUnblockUser
);

// PUT /users/:userId/unblock - Unblock a user
//router.put("/users/:userId/unblock", authenticateToken, unblockUser);

export default router;
