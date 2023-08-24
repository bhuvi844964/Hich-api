import QRCodeScanner from "qrcode-scanner";
import Jimp from "jimp";

export const decodeQRCode = async (qrCodeData) => {
  try {
    // Load the QR code image using Jimp
    const image = await Jimp.read(qrCodeData);

    // Convert the image to a buffer
    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);

    // Create a QRCodeScanner instance
    const scanner = new QRCodeScanner();

    // Decode the QR code from the buffer
    const result = await scanner.scan(buffer);

    // Extract and return the relevant information from the decoded result
    const { content } = result || {};
    return content;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to decode QR code");
  }
};
