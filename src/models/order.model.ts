import { model, Schema } from "mongoose";
import * as orderConstants from "../constants/order.constant";
import { IOrder } from "../interfaces/order.interface";

const orderSchema = new Schema<IOrder>(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    products: [
      {
        quantity: {
          type: Number,
          required: true,
        },
        product: {
          type: Object,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: orderConstants.STATUS_ORDER,
      default: "INITIAL",
    },
    paymentStatus: {
      type: String,
      enum: orderConstants.PAYMENT_STATUS,
      default: "UNPAID",
    },
    paymentMethod: {
      type: String,
      enum: Object.keys(orderConstants.PAYMENT_METHOD),
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Order = model<IOrder>("orders", orderSchema);

export default Order;
