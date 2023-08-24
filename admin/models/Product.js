// product.js
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    nameInHindi: { type: String, required: true },
    nameInEnglish: { type: String, required: true },
    image: { type: String, required: true },
    descriptionInHindi: { type: String, required: true },
    descriptionInEnglish: { type: String, required: true },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.methods.softDelete = function () {
  this.deleted = true;
  this.deletedAt = Date.now();
  return this.save();
};

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Product", productSchema);

export default Product;
