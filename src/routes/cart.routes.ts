import express from "express";
import CartController from "../controllers/cart.controller";
import { checkLogin } from "../middlewares/auth.middleware";

const cartRouter = express.Router();

cartRouter.post("/", checkLogin, CartController.addCart);
cartRouter.get("/my-carts", checkLogin, CartController.getMyCarts);
cartRouter.delete("/:productId", checkLogin, CartController.deleteCart);
cartRouter.put("/", checkLogin, CartController.updateCart);

export default cartRouter;
