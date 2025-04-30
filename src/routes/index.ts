import express from "express";
import authRouter from "./auth.routes";
import cartRouter from "./cart.routes";
import categoryRouter from "./categories.routes";
import orderRouter from "./order.routes";
import productRouter from "./product.routes";
import userRouter from "./user.routes";
// import wishlistRouter from "./wishlist";
// import postRouter from "./post";
// import postCategoryRouter from "./postCategories";
// import sliderRouter from "./slider";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/users", userRouter);
router.use("/carts", cartRouter);
router.use("/orders", orderRouter);
// router.use("/wishlists", wishlistRouter);
// router.use("/post-categories", postCategoryRouter);
// router.use("/posts", postRouter);
// router.use("/sliders", sliderRouter);

export default router;
