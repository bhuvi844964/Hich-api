import express from "express";
import {
  redeemPoints,
  acceptRedeemRequest,
  rejectRedeemRequest,
  redeemRequestListing,
  getUserPoints,
  redeemRequestByUserListing,
  getAllUserPoints,
} from "../controllers/redeemController.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new reward
router.post("/", authenticateToken, redeemPoints);
router.post(
  "/accept/:redeemId",
  authenticateToken,
  authorizeRole("admin"),
  acceptRedeemRequest
);
router.post(
  "/reject/:redeemId",
  authenticateToken,
  authorizeRole("admin"),
  rejectRedeemRequest
);
router.get("/listing", authenticateToken, redeemRequestListing);
router.get("/listingbyuser", authenticateToken, redeemRequestByUserListing);

router.get("/points", authenticateToken, getUserPoints);
router.get("/all-user-points", authenticateToken, getAllUserPoints);

export default router;
