import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  upiId: {
    type: String,
    required: true,
  },
  blocked: { type: Boolean, default: false },
  phone: {
    type: String,
    required: true,
  },
  isCarpenter: {
    type: Boolean,
    required: true,
    default: 0,
  },
  isEnglish: {
    type: Boolean,
    required: true,
    default: 1,
  },
  points: {
    type: Number,
    default: 0,
  },
  pointByAdmin: {
    type: Number,
    default: 0,
  },
  aadharCardNumber: {
    type: String,
  },
  city: {
    type: String,
  },
  area: {
    type: String,
  },
  counterName: {
    type: String,
  },
  counterAddress: {
    type: String,
  },
  contactPerson: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  deviceToken: {
    type: Array,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", userSchema);

export default User;
