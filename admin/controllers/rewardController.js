import multer from "multer";
import Reward from "../models/Reward.js";
import User from "../models/User.js";
import {uploadImage , upload} from "../middlewares/azureStorage.js"
// Configure multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

const hindiLanguageFields = [
  "nameInHindi",
  "descriptionInHindi",
  "image",
  "price",
];
const englishLanguageFields = [
  "nameInEnglish",
  "descriptionInEnglish",
  "image",
  "price",
];

// Get all rewards
export const getAllRewards = async (req, res) => {
  const { limit, page = 1, sortBy, searchValue } = req.query;
  const currentPage = searchValue ? 1 : page;
  try {
    const user = await User.findById(req.userId);
    const selectedFields = user.isEnglish
      ? englishLanguageFields
      : hindiLanguageFields;
    const selectOption = selectedFields.join(" ");
    const options = {
      page: currentPage || 1,
      limit: limit || 10,
      sort: { createdAt: -1 },
    };
    if (req.role === "admin") {
      delete options.select;
    } else {
      options.select = selectOption;
    }
    let query = { deleted: false };

    if (searchValue) {
      query.$or = [
        { nameInHindi: { $regex: searchValue, $options: "i" } },
        { nameInEnglish: { $regex: searchValue, $options: "i" } },
      ];
      //query.name = { $regex: searchValue, $options: "i" };
    }

    const rewards = await Reward.paginate(query, options);

    // Convert binary image to Base64 string
    const rewardsWithBase64Image = rewards.docs.map((reward) => {
      const base64Image = reward.image;

      return {
        ...reward.toObject(),
        base64Image,
      };
    });

    const response = {
      success: true,
      data: {
        docs: rewardsWithBase64Image,
        totalDocs: rewards.totalDocs,
        limit: rewards.limit,
        totalPages: rewards.totalPages,
        page: rewards.page,
        pagingCounter: rewards.pagingCounter,
        hasPrevPage: rewards.hasPrevPage,
        hasNextPage: rewards.hasNextPage,
        prevPage: rewards.prevPage,
        nextPage: rewards.nextPage,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve rewards" });
  }
};

// Get a specific reward by ID
export const getRewardById = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.rewardId);
    if (!reward) {
      return res.status(404).json({ error: "Reward not found" });
    }
    res.json({
      ...reward.toObject(),
      image: reward.image,
    });
    // res.json(reward);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the reward" });
  }
};

// Create a new reward

export const createReward = async (req, res) => {
  const {
    nameInHindi,
    nameInEnglish,
    descriptionInHindi,
    descriptionInEnglish,
    price,
  } = req.body;

  try {
    // Create the reward in the database
    const image = req.file;
    const imageUrl = await uploadImage(image);

    const reward = await Reward.create({
      nameInHindi,
      nameInEnglish,
      image: imageUrl,
      descriptionInHindi,
      descriptionInEnglish,
      price,
    });

    res.status(201).json({ message: "Reward created successfully", reward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create reward" });
  }
};

// Update a reward by ID
export const updateRewardById = async (req, res) => {
  try {
    const rewardId = req.params.rewardId;
    const {
      nameInHindi,
      nameInEnglish,
      descriptionInHindi,
      descriptionInEnglish,
      price,
    } = req.body;
    const image = req.file;
    // Find the reward by ID
    const reward = await Reward.findById(rewardId);

    if (!reward) {
      return res.status(404).json({ message: "Reward not found" });
    }

    if (image) {
      const imageUrl = await uploadImage(image);
      reward.image = imageUrl;
    }

    // Update reward fields
    reward.nameInHindi = nameInHindi || reward.nameInHindi;
    reward.nameInEnglish = nameInEnglish || reward.nameInEnglish;
    reward.descriptionInHindi = descriptionInHindi || reward.descriptionInHindi;
    reward.descriptionInEnglish =
      descriptionInEnglish || reward.descriptionInEnglish;
    reward.price = price || reward.price;

    // Save the updated reward
    const updatedReward = await reward.save();
    res
      .status(200)
      .json({ message: "Reward updated successfully", reward: updatedReward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update reward" });
  }
};

// Delete a reward by ID
export const deleteRewardById = async (req, res) => {
  const rewardId = req.params.rewardId;
  try {
    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return res.status(404).json({ error: "Reward not found" });
    }

    await reward.softDelete();

    res.json({ message: "Reward deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the reward" });
  }
};

// GET /rewards/count - Get the total count of rewards
export const getTotalRewardCount = async (_, res) => {
  try {
    // Retrieve the total count of rewards from the data source
    const count = await Reward.countDocuments({ deleted: false });
    res.status(200).json({ count, message: `Total Count is ${count}` });
  } catch (error) {
    // Handle any errors that occur during the retrieval process
    console.error("Failed to get total reward count:", error);
    throw error;
  }
};

export default {
  getAllRewards,
  getRewardById,
  createReward,
  updateRewardById,
  deleteRewardById,
};

// Middleware for handling file upload
export const uploadImageData = upload.single("image");
