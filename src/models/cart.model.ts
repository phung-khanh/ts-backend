// models/Cart.ts
import { Document, model, Schema } from "mongoose";
import { ICart } from "../interfaces/cart.interface";

const cartSchema = new Schema<ICart & Document>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    products: [
      {
        quantity: {
          type: Number,
          required: true,
        },
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "products",
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = model<ICart & Document>("carts", cartSchema);
export default Cart;
