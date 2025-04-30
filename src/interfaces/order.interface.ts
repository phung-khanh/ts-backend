import { Types } from "mongoose";
import * as orderConstants from "../constants/order.constant";
import { IProduct } from "./product.interface";

export interface IOrderProduct {
  quantity: number;
  product: IProduct[];
}

// Order Interface
export interface IOrder extends Document {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  message?: string;
  totalPrice: number;
  orderBy: Types.ObjectId;
  products: IOrderProduct[];
  status: orderConstants.StatusOrder;
  paymentStatus: orderConstants.PaymentStatus;
  paymentMethod: orderConstants.PaymentMethod;
  discountAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
