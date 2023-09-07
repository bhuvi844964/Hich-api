import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const qrCodeSchema = new mongoose.Schema(
  {
    points: {
      type: Number,
      required: true,
    },
    numberOfQr: {
      type: Number,
    },
    qrData: {
      type: String,
      required: true,
    },
    unique_id: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    redeemed: {
      type: Boolean,
      default: false,
    },
    redeemedAt: {
      type: Date,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

qrCodeSchema.methods.softDelete = function () {
  this.deleted = true;
  this.deletedAt = Date.now();
  return this.save();
};

qrCodeSchema.plugin(mongoosePaginate);

const QRCode = mongoose.model("QRCode", qrCodeSchema);

export default QRCode;
