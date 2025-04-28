import Category from "../models/category.model";
import { asyncHandler } from "../utils/asyncHandler";

export const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find().sort("-createdAt").exec();

    if (!categories) res.status(404).json({ message: "Categories not found" });

    res.json(categories);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name, image } = req.body;
    const category = await new Category({ name, image }).save();

    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export const getCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id).exec();

    res.json(category);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name,
        image,
      },
      { new: true }
    ).exec();

    res.json(category);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id).exec();

    res.json(category);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

const CategoryController = {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};

export default CategoryController;
