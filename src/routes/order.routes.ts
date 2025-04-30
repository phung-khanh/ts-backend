import express from "express";
import OrderController from "../controllers/order.controller";
import { checkLogin, isAdmin } from "../middlewares/auth.middleware";

const orderRouter = express.Router();

orderRouter.post("/", checkLogin, OrderController.createOrder);
orderRouter.get("/", checkLogin, isAdmin, OrderController.getAllOrders);
orderRouter.get("/my-orders", checkLogin, OrderController.myOrders);
orderRouter.get("/:id", checkLogin, OrderController.getOrder);
orderRouter.put("/:id", checkLogin, OrderController.updateStatus);

export default orderRouter;
