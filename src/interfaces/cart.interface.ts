import { Types } from "mongoose";

export interface ICartProduct {
  quantity: number;
  product: Types.ObjectId;
}

export interface ICart {
  user: Types.ObjectId;
  products: ICartProduct[];
  createdAt?: Date;
  updatedAt?: Date;
}
