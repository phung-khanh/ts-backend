import { Request, Response } from "express";
import * as categoryService from "../services/category.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await categoryService.getCategoriesService();
    if (!categories) {
      return res.status(404).json({ message: "Categories not found" });
    }
    res.json(categories);
  }
);

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, image } = req.body;
    const category = await categoryService.createCategoryService(name, image);
    res.status(201).json(category);
  }
);

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await categoryService.getCategoryService(id);
  res.json(category);
});

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, image } = req.body;
    const category = await categoryService.updateCategoryService(id, {
      name,
      image,
    });
    res.json(category);
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await categoryService.deleteCategoryService(id);
    res.json(category);
  }
);

const CategoryController = {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};

export default CategoryController;
