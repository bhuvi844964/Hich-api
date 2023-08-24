import { sendPushNotification } from "../../utils/notificationSender.js";
import { paginationOptionsWIthPopulate } from "../../utils/paginationOptions.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const isValidFCMToken = async (token) => {
  try {
    await admin.messaging().send({ token });

    return true;
  } catch (error) {
    return false;
  }
};

export const sendNotification = async (req, res) => {
  const { content, title } = req.body;

  try {
    // Retrieve all users from the database
    const users = await User.find();

    // Create notifications for each user
    const notifications = [];

    for (const user of users) {
      for (const token of user?.deviceToken) {
        if (token !== "" && token !== null && token !== "null") {
          const ss = await sendPushNotification([token], title, content);
          await Notification.create({
            content: content,
            title:"Hich Notification",
            userId: user._id,
          });
        }
      }
    }

    res
      .status(201)
      .json({ status: 201, message: "Notifications created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating notifications" });
  }
};

export const getNotifications = async (req, res) => {
  const user = { path: "userId" };

  const {
    page = 1,
    limit = 10,
    sortKey = "createdAt",
    sortOrder = "desc",
  } = req.query;

  try {
    const query = {}; // Update the query to use the userId

    const paginationResult = await Notification.paginate(
      query,
      paginationOptionsWIthPopulate(page, limit, user, sortOrder, sortKey)
    );
    return res.status(200).json({ notifications: paginationResult });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching notifications" });
  }
};

export const getNotificationsByUser = async (req, res) => {
  const { userId } = req.params;
  const user = { path: "userId" };

  const {
    page = 1,
    limit = 10,
    sortKey = "createdAt",
    sortOrder = "desc",
  } = req.query;

  try {
    const query = { userId }; // Update the query to use the userId

    const paginationResult = await Notification.paginate(
      query,
      paginationOptionsWIthPopulate(page, limit, user, sortOrder, sortKey)
    );
    return res.status(200).json({ notifications: paginationResult });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching notifications" });
  }
};

export const deleteNotifications = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Delete notifications for the specified user
    await Notification.deleteMany({ userId });

    return res
      .status(200)
      .json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting notifications" });
  }
};
