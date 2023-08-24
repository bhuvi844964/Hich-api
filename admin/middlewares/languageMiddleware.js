import User from "../models/User.js";

const languageMiddleware = async (req, res, next) => {
  try {
    //const userId = req.userId;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.language = user.language;

    // Set the language preference in the response headers
    // res.set("Content-Language", userLanguage);

    // Continue to the next middleware
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export default languageMiddleware;
