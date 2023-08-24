import qrcode from "qrcode";

export const generateQRCode = async (data) => {
  try {
    //const qrData = `Points: ${points}`;
    const qrData = `{points: ${data?.points}, id: ${data?.unique_id}}`;
    const options = {
      type: "png", // Specify the image type (e.g., png, svg, jpeg)
      quality: 0.8, // Specify the image quality (0 to 1)
      margin: 1, // Specify the QR code margin (in modules)
      scale: 6, // Specify the scaling factor of the QR code
    };

    const qrCodeDataUrl = await qrcode.toDataURL(qrData, options);

    return qrCodeDataUrl;
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
};
