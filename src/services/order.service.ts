import { PAYMENT_STATUS, STATUS_ORDER } from "../constants/order.constant";
import Cart from "../models/cart.model";
import Order from "../models/order.model";
import Product from "../models/product.model";
import sendMail from "../utils/sendMail";

export const getOrdersService = async (userId: string) => {
  return await Order.findById({ userId }).exec();
};

export const getAllOrdersService = async () => {
  return await Order.find().sort({ createdAt: -1 }).exec();
};

export const myOrdersService = async (userId: string) => {
  return await Order.find({ orderBy: userId })
    .sort({ createdAt: -1 })
    .exec();
};

export const createOrderService = async (userId: string, orderData: any) => {
  const {
    customerName,
    customerPhone,
    customerEmail,
    address,
    message,
    paymentMethod,
  } = orderData;

  // Check for address validity
  if (!address || address.trim() === "") {
    throw new Error("Address is required for placing an order");
  }

  // Find cart for the user
  const cart = await Cart.findOne({ user: userId }).exec();
  if (!cart) {
    throw new Error("Cart not found");
  }

  // Prepare products to be ordered
  const productsOrder = [];
  for (const item of cart.products) {
    const product = await Product.findById(item.product).exec();
    productsOrder.push({
      quantity: item.quantity,
      product,
    });
  }

  // Calculate total price
  const totalPrice = productsOrder.reduce((total, item) => {
    const productPrice =
      (item.product?.salePrice ?? 0) > 0
        ? item.product?.salePrice
        : item.product?.price || 0;
    return total + item.quantity * (productPrice ?? 0);
  }, 0);

  // Create the order
  const order = await new Order({
    customerName,
    customerEmail,
    customerPhone,
    address,
    message,
    orderBy: userId,
    totalPrice,
    products: productsOrder,
    paymentMethod,
  }).save();

  // Remove cart after creating order
  await Cart.deleteOne({ user: userId });

  // Send order confirmation email
  await sendMail({
    toEmail: customerEmail,
    title: "Order Confirmation - Your Order has been Placed Successfully",
    content: `
      <html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f7fc; color: #333;">
          <table role="presentation" style="width: 100%; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <tr>
              <td style="text-align: center; padding-bottom: 20px;">
                <h2 style="color: #4CAF50; font-size: 24px; margin-bottom: 10px;">Order Confirmation</h2>
                <p style="font-size: 16px; color: #777;">Thank you for your purchase!</p>
              </td>
            </tr>
            <tr>
              <td style="font-size: 16px; line-height: 1.6; padding-bottom: 20px;">
                <p>Dear <strong>${customerName}</strong>,</p>
                <p>We are excited to confirm that we have received your order. Below are the details:</p>
                <table style="width: 100%; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin-top: 20px;">
                  <tr>
                    <td style="padding: 10px; background-color: #f8f8f8; font-weight: bold;">Order ID</td>
                    <td style="padding: 10px; background-color: #fff;">${
                      order._id
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; background-color: #f8f8f8; font-weight: bold;">Total Price</td>
                    <td style="padding: 10px; background-color: #fff;">${totalPrice} VND</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; background-color: #f8f8f8; font-weight: bold;">Shipping Address</td>
                    <td style="padding: 10px; background-color: #fff;">${address}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; background-color: #f8f8f8; font-weight: bold;">Message</td>
                    <td style="padding: 10px; background-color: #fff;">${
                      message || "No message provided"
                    }</td>
                  </tr>
                </table>
                <p style="margin-top: 20px;">Your order is being processed and we will notify you once it is shipped. We appreciate your trust in us!</p>
              </td>
            </tr>
            <tr>
              <td style="font-size: 14px; line-height: 1.6; color: #777; padding-top: 20px; border-top: 1px solid #ddd;">
                <p>If you have any questions or concerns, feel free to reach out to our customer support.</p>
                <p>Best regards,</p>
                <p><strong>Noel Techshop</strong></p>
                <p style="font-size: 12px; color: #aaa;">&copy; 2024 Noel Techshop | All Rights Reserved</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });

  return order;
};

export const updateOrderStatusService = async (
  orderId: string,
  status: string,
  paymentStatus: string
) => {
  if (
    status &&
    !STATUS_ORDER.includes(
      status as
        | "INITIAL"
        | "CONFIRMED"
        | "DELIVERING"
        | "DELIVERED"
        | "CANCELED"
    )
  ) {
    throw new Error("Status is not valid");
  }

  if (
    paymentStatus &&
    !PAYMENT_STATUS.includes(paymentStatus as "PAID" | "UNPAID")
  ) {
    throw new Error("Payment Status is not valid");
  }

  // Update order status and payment status
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status, paymentStatus },
    { new: true }
  ).exec();

  return updatedOrder;
};
