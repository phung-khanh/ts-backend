import Category from "../models/category.model";
import Product from "../models/product.model";

export const getProducts = async (search: string) => {
  const queryObj: { name?: { $regex: RegExp } } = {};
  if (search) {
    const nameRegex = new RegExp(search, "i");
    queryObj.name = { $regex: nameRegex };
  }
  return await Product.find(queryObj)
    .populate(["category", "posts"])
    .sort("-createdAt")
    .exec();
};

export const getProductsHome = async () => {
  const categories = await Category.find().exec();
  return await Promise.all(
    categories.map(async (category) => {
      const products = await Product.find({ category: category._id }).exec();
      return {
        ...category.toJSON(),
        products,
      };
    })
  );
};

export const getRelatedProducts = async (productId: string) => {
  const product = await Product.findById(productId).exec();
  if (!product) {
    throw new Error("Product not found");
  }
  return await Product.find({
    $and: [{ _id: { $ne: product._id } }, { category: product.category }],
  })
    .populate(["category", "posts"])
    .exec();
};

export const createProduct = async (productData: any) => {
  const product = await new Product(productData).save();
  return product;
};

export const getProduct = async (productId: string) => {
  return await Product.findByIdAndUpdate(
    productId,
    { $inc: { view: 1 } },
    { new: true }
  )
    .populate(["category", "posts"])
    .exec();
};

export const updateProduct = async (productId: string, productData: any) => {
  return await Product.findByIdAndUpdate(productId, productData, {
    new: true,
  }).exec();
};

export const deleteProduct = async (productId: string) => {
  return await Product.findByIdAndDelete(productId).exec();
};
