import * as cartService from "../services/cart.service";
import { AuthenticatedRequest } from "../types/authencation";
import { asyncHandler } from "../utils/asyncHandler";

export const addCart = asyncHandler<AuthenticatedRequest>(async (req, res) => {
  const user = req.user?.id!;
  const { productId, quantity } = req.body;

  const data = await cartService.addToCartService(user, productId, quantity);

  res.json({
    message: "Add cart successfully",
    data,
  });
});

export const getMyCarts = asyncHandler<AuthenticatedRequest>(
  async (req, res) => {
    const user = req.user?.id!;
    const data = await cartService.getUserCartService(user);

    if (!data) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(data);
  }
);

export const deleteCart = asyncHandler<AuthenticatedRequest>(
  async (req, res) => {
    const user = req.user?.id!;
    const { productId } = req.params;

    const result = await cartService.deleteFromCartService(user, productId);
    if (!result) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(result);
  }
);

export const updateCart = asyncHandler<AuthenticatedRequest>(
  async (req, res) => {
    const user = req.user?.id!;
    const { productId, quantity } = req.body;

    const result = await cartService.updateCartQuantityService(
      user,
      productId,
      quantity
    );
    if (!result) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(result);
  }
);

const CartController = {
  addCart,
  getMyCarts,
  deleteCart,
  updateCart,
};
export default CartController;
