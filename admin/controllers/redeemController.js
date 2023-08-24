import User from "../models/User.js";
import Redeem from "../models/Redeem.js";
import { paginationOptionsWIthPopulate } from "../../utils/paginationOptions.js";
import ScanQRCode from "../models/ScanQRCode.js";
import QRCode from "../models/QRCode.js";
import mongoose from "mongoose";

export const redeemPoints = async (req, res) => {
  const { points, userId } = req.body;
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if the user has enough points to redeem
    if (user.points < points) {
      return res.status(401).json({ message: "Insufficient points" });
    }

    // Check if the user has already request to redeem
    const existingScan = await Redeem.findOne({
      userId,
      points,
    });

    if (existingScan) {
      return res
        .status(400)
        .json({ message: "Request has been already sent for this redeem" });
    }

    // Create a redeem record
    const redeem = new Redeem({
      userId,
      points,
      status: "pending",
    });

    // Save the redeem record
    await redeem.save();

    // Update the user's points
    // user.points -= points;
    // await user.save();

    return res.status(201).json({
      success: true,
      message: "Request successfully sent to Accept/Reject",
    });
  } catch (error) {
    console.log("EEEE::", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to redeem points" });
  }
};

const userId = "60f7165b9b55a72fd4cfd1e1"; // ID of the user redeeming points
// const pointsToRedeem = 100; // Number of points to redeem

export const acceptRedeemRequest = async (req, res) => {
  try {
    const redeem = await Redeem.findById(req.params.redeemId).populate(
      "userId"
    );

    const user = await User.findById(redeem?.userId?._id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (!redeem) {
      return res.status(401).json({ message: "Redeem not found" });
    }
    // Deduct the points from the user's balance
    user.points -= redeem.points;
    redeem.status = "completed";
    // Save the updated user
    await user.save();
    await redeem.save();
    return res.status(201).json({
      success: true,
      message: "Request accepted successfully",
    });
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const rejectRedeemRequest = async (req, res) => {
  try {
    const redeem = await Redeem.findById(req.params.redeemId);
    const user = await User.findById(redeem?.userId?._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (!redeem) {
      return res.status(401).json({ message: "Redeem not found" });
    }

    redeem.status = "rejected";

    await redeem.save();
    return res.status(201).json({
      success: true,
      message: "Request rejected successfully",
    });
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const redeemRequestListing = async (req, res) => {
  const user = { path: "userId" };
  // const options = {
  //   page: 1, // Current page number
  //   limit: 10, // Number of documents per page
  //   populate: user,
  // };

  try {
    const { status, limit, page } = req.query;
    const query = status ? { status } : {};

    const paginationResult = await Redeem.paginate(
      query,
      paginationOptionsWIthPopulate(page, limit, user, "desc", "redeemedAt")
    );
    return res.status(200).json({ redeemRequests: paginationResult });
    // }
  } catch (error) {
    console.log("ERROR:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getUserPoints = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    const scanqrcode = await ScanQRCode.find({ userId });
    const qrcodeIds = scanqrcode.map((code) => code.qrcodeId);

    const pointsAggregate = await QRCode.aggregate([
      {
        $match: {
          unique_id: { $in: qrcodeIds },
        },
      },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: "$points" },
        },
      },
    ]);

    const userTotalPoints = pointsAggregate[0]?.totalPoints;

    const aggregateQuery = [
      {
        $match: {
          userId: user?._id,
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$userId",
          totalPoints: { $sum: "$points" },
        },
      },
    ];

    const usedPoints = await Redeem.aggregate(aggregateQuery);
    const userUsedPoints = usedPoints[0]?.totalPoints || 0;
    const userRemainingPoints = userTotalPoints - userUsedPoints;

    return res.status(201).json({
      success: true,
      points: {
        userTotalPoints,
        userUsedPoints,
        userRemainingPoints,
      },
    });
  } catch (error) {
    console.log("ERROR::", error.message);
    return { success: false, message: error.message };
  }
};

export const redeemRequestByUserListing = async (req, res) => {
  const user = { path: "userId" };
  const userId = req.userId;
  try {
    const { status, limit, page } = req.query;
    const query = { userId };

    const paginateResult = await Redeem.paginate(
      query,
      paginationOptionsWIthPopulate(page, limit, user, "desc", "redeemedAt")
    );
    return res.status(201).json({
      success: true,
      paginateResult,
    });
    //return paginateResult;
  } catch (error) {
    console.log("ERROR::", error.message);
    return { success: false, message: error.message };
  }
};

export const getAllUserPoints = async (req, res) => {
  try {
    // Retrieve all users
    const users = await User.find();

    const userIds = users.map((user) => user._id);

    const scanqrcode = await ScanQRCode.find({ userId: { $in: userIds } });
    const qrcodeIds = scanqrcode.map((code) => code.qrcodeId);

    const pointsAggregate = await QRCode.aggregate([
      {
        $match: {
          unique_id: { $in: qrcodeIds },
        },
      },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: "$points" },
        },
      },
    ]);

    const userPointsMap = new Map();

    for (const user of users) {
      userPointsMap.set(user._id.toString(), {
        name: user.name,
        email: user.email,
        phone: user.phone,
        counterName: user.counterName,
        city: user.city,
        totalPoints: 0,
        usedPoints: 0,
        remainingPoints: 0,
      });
    }

    for (const code of scanqrcode) {
      const userId = code.userId.toString();
      const qrcodeId = code.qrcodeId.toString();
      const qrCodePoints = await QRCode.findOne({ unique_id: qrcodeId });

      if (qrCodePoints) {
        userPointsMap.get(userId).totalPoints += qrCodePoints.points;
      }
    }

    const aggregateQuery = [
      {
        $match: {
          userId: { $in: userIds },
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$userId",
          totalPoints: { $sum: "$points" },
        },
      },
    ];

    const usedPoints = await Redeem.aggregate(aggregateQuery);

    for (const points of usedPoints) {
      const userId = points._id.toString();
      userPointsMap.get(userId).usedPoints = points.totalPoints;
    }

    for (const [userId, userPoints] of userPointsMap.entries()) {
      userPoints.remainingPoints =
        userPoints.totalPoints - userPoints.usedPoints;
    }

    const userPointsArray = Array.from(userPointsMap.values());

    return res.status(201).json({
      success: true,
      users: userPointsArray,
    });
  } catch (error) {
    console.log("ERROR::", error.message);
    return { success: false, message: error.message };
  }
};
