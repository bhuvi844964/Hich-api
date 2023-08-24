import QRCode from "../models/QRCode.js";
import { generateQRCode } from "../../utils/qrCodeGenerator.js";
import crypto from "crypto";
import { paginationOptions } from "../../utils/paginationOptions.js";

export const createQRCode = async (req, res) => {
  try {
    const { points } = req.body;
    const unique_id = crypto.randomBytes(10).toString("hex");
    // Generate QR code logic
    const qrData = await generateQRCode({ points, unique_id }); // Assuming you have a separate utility function to generate the QR code

    const qrCode = new QRCode({
      points,
      qrData,
      unique_id,
    });

    await qrCode.save();

    res.status(201).json({ message: "QR Code created successfully" });
  } catch (error) {
    console.log("Eror::", error.message);
    res.status(500).json({ error: "Failed to create QR Code" });
  }
};

// Delete a QR Code
export const deleteQRCode = async (req, res) => {
  const qrcodeId = req.params.qrcodeId;
  try {
    const qrCode = await QRCode.findById(qrcodeId);

    if (!qrCode) {
      return res.status(404).json({ error: "QR Code not found" });
    }

    await qrCode.softDelete();

    res.json({ message: "QR Code deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete QR Code" });
  }
};

// Get all QR Codes
export const getQRCodeList = async (req, res) => {
  const { limit, page, sortBy, searchValue } = req.query;
  const sortField = "createdAt";
  const sortOrder = "desc";
  const query = { deleted: false };

  if (Number(searchValue)) {
    query.points = searchValue;
  }
  try {
    const qrCodes = await QRCode.paginate(
      query,
      paginationOptions(searchValue ? 1 : page, limit, sortField, sortOrder)
    );
    res.json(qrCodes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch QR Codes" });
  }
};

export const getQRCodeById = async (req, res) => {
  try {
    const qrcodeId = req.params.qrcodeId;

    // Find the QR code by ID
    const qrcode = await QRCode.findById(qrcodeId);

    if (!qrcode) {
      return res.status(404).json({ message: "QR code not found" });
    }

    res.status(200).json({ qrcode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get QR code" });
  }
};
