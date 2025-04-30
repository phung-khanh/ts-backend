import express from "express";
import authRouter from "./auth.routes";
// import cartRouter from "./cart";
import categoryRouter from "./categories.routes";
// import orderRouter from "./order";
// import postRouter from "./post";
// import postCategoryRouter from "./postCategories";
import productRouter from "./product.routes";
// import sliderRouter from "./slider";
import userRouter from "./user.routes";
// import wishlistRouter from "./wishlist";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/categories", categoryRouter);
// router.use("/post-categories", postCategoryRouter);
// router.use("/posts", postRouter);
router.use("/products", productRouter);
router.use("/users", userRouter);
// router.use("/sliders", sliderRouter);
// router.use("/carts", cartRouter);
// router.use("/orders", orderRouter);
// router.use("/wishlists", wishlistRouter);
export default router;
