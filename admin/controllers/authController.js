import User from "../models/User.js";
import { generateToken } from "../middlewares/authMiddleware.js";
import crypto from "crypto";
import RefreshToken from "../models/RefreshToken.js";

export const registerUser = async (req, res) => {
  const {
    name,
    isCarpenter,
    isEnglish,
    phone,
    role,
    aadharCardNumber,
    city,
    area,
    counterName,
    counterAddress,
    contactPerson,
    mobileNumber,
    upiId,
  } = req.body;
  //const upiId = crypto.randomBytes(10).toString("hex");
  // Check if the required fields are provided
  if (!name || !upiId || !phone) {
    return res
      .status(400)
      .json({ message: "Name, upiId and phone are required." });
  }

  try {
    // Check if the user already exists with the given email or name
    //const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Create a new user instance
    const newUser = new User({
      name,
      upiId,
      isCarpenter,
      isEnglish,
      phone,
      aadharCardNumber,
      city,
      area,
      counterName,
      counterAddress,
      contactPerson,
      mobileNumber,
      role: role || "user",
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate and return the JWT token
    const token = generateToken(savedUser);

    return res.status(201).json({ token, refreshToken: token });
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
};

export const loginUser = async (req, res) => {
  const { phone, deviceToken } = req.body;

  // Check if the phone number is provided
  if (!phone) {
    return res.status(400).json({ message: "Phone No. is required." });
  }

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({ message: "No User with this number." });
    }

    if (user) {
      const existingDeviceTokenIndex = user.deviceToken.indexOf(deviceToken);

      if (existingDeviceTokenIndex !== -1) {
        user.deviceToken.splice(existingDeviceTokenIndex, 1);
      }

      user.deviceToken.push(deviceToken);

      // Generate a JWT token for the logged-in user
      const token = generateToken(
        {
          _id: user.id,
          role: user.role,
          name: user.name,
        },
        "accessToken"
      );

      // Generate a refresh token
      const refreshToken = generateToken(
        {
          _id: user.id,
          role: user.role,
          name: user.name,
        },
        "refreshToken"
      );

      try {
        // Create a new RefreshToken instance
        const newRefreshToken = new RefreshToken({
          token: refreshToken,
          userId: user._id,
        });

        // Save the refresh token to the database
        await newRefreshToken.save();

        // Save the user with the updated deviceToken
        await user.save();

        // Return the tokens in the response
        return res.status(201).json({ token, refreshToken });
      } catch (error) {
        throw error;
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
};

export const logout = async (req, res) => {
  const userId = req.userId;

  try {
    // Find the user by userId

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    // Clear the refresh tokens associated with the user

    await RefreshToken.deleteMany({ userId: user._id });

    return res.status(200).json({ error: false, message: "Logout successful" });
  } catch (error) {
    console.error(error);

    return res.status(400).json({ error: true, message: error.message });
  }
};
