import { Schema } from "mongoose";
import { IProduct } from "../interfaces/product.interface";
import mongoose, { model } from "mongoose";

const product = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    view: {
      type: Number,
      default: 0,
    },
    category: [
      {
        type: mongoose.Types.ObjectId,
        ref: "categories",
        required: true,
      },
    ],
    brand: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "posts",
        required: true,
      },
    ],
  },
  { timestamps: true }
);
const Product = model<IProduct>("products", product);
export default Product;
