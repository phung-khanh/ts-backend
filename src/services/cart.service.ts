import Cart from "../models/cart.model";

export const addToCartService = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  let cart = await Cart.findOne({ user: userId }).exec();

  if (cart) {
    const foundProduct = cart.products.find(
      (it) => it.product.toString() === productId
    );

    if (foundProduct) {
      foundProduct.quantity += quantity;
      cart.products = cart.products.map((it) =>
        it.product.toString() === foundProduct.product.toString()
          ? foundProduct
          : it
      );
    }

    return await cart.save();
  } else {
    const newCart = new Cart({
      user: userId,
      products: [{ product: productId, quantity }],
    });
    return await newCart.save();
  }
};

export const getUserCartService = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId })
    .populate({
      path: "products.product",
      model: "products",
    })
    .exec();

  if (!cart) return null;

  cart.products = cart.products.reverse();

  const totalPrice = cart.products.reduce((res, curr) => {
    const product = curr.product as any;
    const price = product.salePrice > 0 ? product.salePrice : product.price;
    return res + price * curr.quantity;
  }, 0);

  return {
    ...cart.toJSON(),
    totalPrice,
  };
};

export const deleteFromCartService = async (
  userId: string,
  productId: string
) => {
  const cart = await Cart.findOne({ user: userId }).exec();
  if (!cart) return null;

  cart.products = cart.products.filter(
    (it) => it.product._id.toString() !== productId
  );
  await cart.save();

  return cart.products;
};

export const updateCartQuantityService = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const cart = await Cart.findOne({ user: userId }).exec();
  if (!cart) return null;

  cart.products = cart.products.map((it) =>
    it.product._id.toString() === productId ? { ...it, quantity } : it
  );
  await cart.save();

  return cart.products;
};
