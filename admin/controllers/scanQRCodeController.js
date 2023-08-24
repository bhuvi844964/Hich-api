//import { decodeQRCode } from "../../utils/decodeQRCode";
import QRCode from "../models/QRCode.js";
import ScanQRCode from "../models/ScanQRCode.js";
import User from "../models/User.js";

export const scanQRCode = async (req, res) => {
  try {
    // const userId = req.userId;

    // const qrCodeData = req.body;

    //const qrCodeId = req.body.qrCodeId; // Assuming you get the QR code ID from the request body

    // Find the QR code by ID
    //const qrCode = await QRCode.findOne({ unique_id: qrCodeData?.unique_id });
    const qrCode = await QRCode.findOne({ unique_id: req.body?.unique_id });

    if (!qrCode) {
      return res.status(404).json({ message: "QR code not found" });
    }

    // Check if the user has already scanned the QR code
    const existingScan = await ScanQRCode.findOne({
      userId: req.body.userId,
      qrcodeId: qrCode?.unique_id,
    });

    if (existingScan) {
      return res
        .status(200)
        .json({ status: 409, message: "QR code already scanned by the user" });
    }

    // Add points to the user
    const pointsToAdd = qrCode.points;
    const scannedUser = await User.findOne({ _id: req.body.userId });
    scannedUser.points += pointsToAdd;
    scannedUser.save();

    // Create a new scan instance
    const newScan = new ScanQRCode({
      userId: req.body.userId,
      qrcodeId: qrCode?.unique_id,
    });

    // Save the scan to the database
    await newScan.save();

    res
      .status(200)
      .json({ status: 200, message: "QR code scanned successfully" });
  } catch (error) {
    console.error("Errorrrr::", error.message);
    res.status(500).json({ message: "Failed to scan QR code" });
  }
};
