import express from "express";
import CategoryController from "../controllers/categories.controller";
import { checkLogin, isAdmin } from "../middlewares/auth.middleware";

const categoryRouter = express.Router();

categoryRouter.get("/", CategoryController.getCategories);
categoryRouter.get("/:id", CategoryController.getCategory);
categoryRouter.post(
  "/",
  checkLogin,
  isAdmin,
  CategoryController.createCategory
);
categoryRouter.put(
  "/:id",
  checkLogin,
  isAdmin,
  CategoryController.updateCategory
);
categoryRouter.delete(
  "/:id",
  checkLogin,
  isAdmin,
  CategoryController.deleteCategory
);

export default categoryRouter;
