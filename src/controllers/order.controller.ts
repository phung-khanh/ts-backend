import { Request, Response } from "express";
import * as orderService from "../services/order.service";
import { AuthenticatedRequest } from "../types/authencation";
import { asyncHandler } from "../utils/asyncHandler";

export const createOrder = asyncHandler<AuthenticatedRequest>(
  async (req, res) => {
    try {
      const orderBy = req.user?.id;
      const orderData = req.body;

      if (!orderBy) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const order = await orderService.createOrderService(orderBy, orderData);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);

export const getOrder = asyncHandler<AuthenticatedRequest>(async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrdersService(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    res.json(order);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

export const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await orderService.getAllOrdersService();
    if (!orders) {
      return res.status(404).json({ message: "No orders found!" });
    }
    res.json(orders);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

export const myOrders = asyncHandler<AuthenticatedRequest>(async (req, res) => {
  try {
    const userId = req.user?.id;
    const orders = await orderService.myOrdersService(String(userId));
    res.json(orders);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

export const updateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, paymentStatus } = req.body;

      const updatedOrder = await orderService.updateOrderStatusService(
        id,
        status,
        paymentStatus
      );
      res.json(updatedOrder);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);

const OrderController = {
  createOrder,
  getAllOrders,
  myOrders,
  getOrder,
  updateStatus,
};

export default OrderController;
