import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();

const generateToken = (data, tokenType = "accessToken") => {
  // Generate a new JWT token with the user ID
  const token =
    tokenType === "accessToken"
      ? jwt.sign(
          {
            userId: data._id,
            role: data.role,
            name: data.name,
          },
          process.env.SECRETKEY,
          {
            expiresIn: "7d",
          }
        )
      : jwt.sign(
          {
            userId: data._id,
            role: data.role,
            name: data.name,
          },
          process.env.SECRETKEY
        );

  return token;
};

const authenticateToken = (req, res, next) => {
  // Get the JWT token from the request header
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    // Token is missing or has an incorrect format, return an error
    return res.status(401).json({ error: "Invalid token format" });
  }

  const token = authorizationHeader.substring(7);

  if (!token) {
    // Token is missing, return an error
    return res.status(401).json({ error: "Token is missing" });
  }

  // Verify the JWT token
  jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
    if (err) {
      // Token is invalid, return an error
      return res.status(403).json({ error: "Invalid token" });
    }
    try {
      // Check if the user exists in the database
      const user = await User.findById(decoded.userId);
      if (!user) {
        // User not found, return an error
        return res.status(404).json({ error: "User not found ttt" });
      }

      // User is found, save the decoded user ID in the request object
      req.userId = decoded.userId;
      req.role = decoded.role;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};

// Middleware to authorize access based on user role
const authorizeRole = (role) => (req, res, next) => {
  // Check if the authenticated user's role matches the required role

  if (req.role !== role) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

export { generateToken, authenticateToken, authorizeRole };
