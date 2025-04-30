export const STATUS_ORDER = [
  "INITIAL",
  "CONFIRMED",
  "DELIVERING",
  "DELIVERED",
  "CANCELED",
] as const;

export const PAYMENT_STATUS = ["PAID", "UNPAID"] as const;

export const PAYMENT_METHOD = {
  COD: "COD",
  VNPAY: "VNPAY",
} as const;

export type StatusOrder = (typeof STATUS_ORDER)[number];
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];
export type PaymentMethod = keyof typeof PAYMENT_METHOD;
