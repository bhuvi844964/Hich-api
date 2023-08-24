import mongoose from "mongoose";

const scanQRCodeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    qrcodeId: {
      type: String,
      ref: "QRCode",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const ScanQRCode = mongoose.model("ScanQRCode", scanQRCodeSchema);

export default ScanQRCode;
