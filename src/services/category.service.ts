import Category from "../models/category.model";

export const getCategoriesService = async () => {
  const categories = await Category.find().sort("-createdAt").exec();
  return categories;
};

export const createCategoryService = async (name: string, image: string) => {
  const category = await new Category({ name, image }).save();
  return category;
};

export const getCategoryService = async (id: string) => {
  const category = await Category.findById(id).exec();
  return category;
};

export const updateCategoryService = async (
  id: string,
  data: { name: string; image: string }
) => {
  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
  }).exec();
  return category;
};

export const deleteCategoryService = async (id: string) => {
  const category = await Category.findByIdAndDelete(id).exec();
  return category;
};
