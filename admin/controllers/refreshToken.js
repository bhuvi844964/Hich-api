import { generateToken } from "../middlewares/authMiddleware.js";
import RefreshToken from "../models/RefreshToken.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // Verify the refresh token
    const decodedToken = jwt.verify(refreshToken, process.env.SECRETKEY);
    const userId = decodedToken?.userId;

    // Find the refresh token in the database

    const storedRefreshToken = await RefreshToken.findOne({
      token: refreshToken,
      userId,
    });
    if (!storedRefreshToken) {
      return res

        .status(401)

        .json({ error: true, message: "Invalid refresh token" });
    }

    // Generate a new access token

    const accessToken = generateToken(
      {
        _id: decodedToken.userId,
        role: decodedToken.role,
        name: decodedToken.name,
      },
      "accessToken"
    );

    // const accessToken = jwt.sign(
    //   {
    //     user: {
    //       _id: decodedToken.id,
    //       role: decodedToken.role,
    //       name: decodedToken.name,
    //       email: decodedToken.email,
    //     },
    //   },

    //   process.env.JWT_SECRET,

    //   { expiresIn: "2m" }
    // );

    return res.status(200).json({
      error: false,

      message: "Access token refreshed",

      accessToken,
    });
  } catch (error) {
    console.error("TESTTTT::", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: true,

        message: "Refresh token expired",
      });
    }

    return res.status(400).json({ error: true, message: error.message });
  }
};
