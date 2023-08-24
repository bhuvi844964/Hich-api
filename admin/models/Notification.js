// Notification.js
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.plugin(mongoosePaginate);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
