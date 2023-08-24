import { paginationOptions } from "../../utils/paginationOptions.js";
import Redeem from "../models/Redeem.js";
import User from "../models/User.js";

export const createUser = async (req, res) => {
  try {
    const { name, upiId, isCarpenter, isEnglish } = req.body;

    const user = await User.create({
      name,
      upiId,

      isCarpenter,
      isEnglish,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const updateUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
//     return user;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

export const updateUser = async (req, res) => {
  try {
    const {
      name,
      upiId,
      mobileNumber,
      phone,
      isCarpenter,
      isEnglish,
      language,
      aadharCardNumber,
      city,
      area,
      counterName,
      counterAddress,
      contactPerson,
      points,
      pointByAdmin,
    } = req.body;
    const { id } = req.params;

    // Check if the new phone number already exists in the database
    const existingUser = await User.findOne({
      phone: phone,
      _id: { $ne: id },
    });
    console.log("EXisting user: " + existingUser);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Phone number is already taken." });
    }

    // Get the user's existing points
    const existingUserPoints = await User.findById(id);
    const totalPoints = existingUserPoints ? existingUserPoints?.points : 0;
    const updatedPoints = Number(totalPoints) + Number(pointByAdmin);

    const updatedFields = {
      name,
      upiId,
      mobileNumber,
      phone,
      isCarpenter,
      isEnglish,
      language,
      aadharCardNumber,
      city,
      area,
      counterName,
      counterAddress,
      contactPerson,
      points: updatedPoints,
      pointByAdmin,
    };

    const user = await User.findByIdAndUpdate(id, updatedFields, { new: true });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const usersRedeemRequest = await getTotalRedeemRequests(id);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user, requests: usersRedeemRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted User" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  const { limit, page, sortBy, searchValue } = req.query;

  try {
    const query = { role: "user" };

    const sortOptions = {};
    if (sortBy) {
      // Assuming sortBy is a field name, e.g., "name" or "createdAt"
      sortOptions[sortBy] = 1; // 1 for ascending order, -1 for descending order
    }

    // Apply filtering options if searchValue is provided
    if (searchValue) {
      query.name = { $regex: searchValue, $options: "i" };
    }
    const users = await User.paginate(
      query,
      paginationOptions(searchValue ? 1 : page, limit, sortOptions)
    );
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /users/:userId/block - Block a user
export const blockUnblockUser = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.blocked = !user.blocked;
  await user.save();
  res.json({
    message: user.blocked
      ? `User blocked successfully`
      : `User unblocked successfully`,
  });
};

// PUT /users/:userId/unblock - Unblock a user
export const unblockUser = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.blocked = false;
  await user.save();
  res.json({ message: "User unblocked successfully" });
};

// GET /users/count - Get the total count of users
export const getTotalUserCount = async (_, res) => {
  try {
    // Retrieve the total count of users from the data source
    const count = await User.countDocuments({});
    res.status(200).json({ count, message: `Total Count is ${count}` });
  } catch (error) {
    // Handle any errors that occur during the retrieval process
    console.error("Failed to get total user count:", error);
    throw error;
  }
};

const getTotalRedeemRequests = async (userId) => {
  try {
    const acceptedRequests = await Redeem.countDocuments({
      userId,
      status: "completed",
    });
    const rejectedRequests = await Redeem.countDocuments({
      userId,
      status: "rejected",
    });
    const pendingRequests = await Redeem.countDocuments({
      userId,
      status: "pending",
    });
    const totalRequest = acceptedRequests + rejectedRequests + pendingRequests;

    return {
      acceptedRequests,
      rejectedRequests,
      pendingRequests,
      totalRequest,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
