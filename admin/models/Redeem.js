import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const redeemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  rewardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reward",
    //required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "rejected"],
    default: "pending",
  },
  redeemedAt: {
    type: Date,
    default: Date.now,
  },
});

redeemSchema.plugin(mongoosePaginate);

const Redeem = mongoose.model("Redeem", redeemSchema);

export default Redeem;
