import Category from "../models/category.model";
import Product from "../models/product.model";
import { asyncHandler } from "../utils/asyncHandler";

export const getProducts = asyncHandler(async (req, res) => {
  try {
    const { search } = req.query;
    const queryObj: { name?: { $regex: RegExp } } = {};
    if (search) {
      const nameRegex = new RegExp(search as string, "i");
      queryObj.name = {
        $regex: nameRegex,
      };
    }

    const products = await Product.find(queryObj)
      .populate(["category", "posts"])
      .sort("-createdAt")
      .exec();

    res.json(products);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export const getProductsHome = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find().exec();
    const products = await Promise.all(
      categories.map(async (it) => {
        const products = await Product.find({ category: it._id }).exec();

        return {
          ...it.toJSON(),
          products,
        };
      })
    );

    res.json(products);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export const getRelatedProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).exec();
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const productsRelated = await Product.find({
      $and: [
        {
          _id: { $ne: product._id },
        },
        {
          category: product.category,
        },
      ],
    })
      .populate(["category", "posts"])
      .exec();

    res.json(productsRelated);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      image,
      price,
      salePrice,
      category,
      description,
      brand,
      posts,
    } = req.body;
    const product = await new Product({
      name,
      image,
      price,
      salePrice,
      category,
      description,
      brand,
      posts,
    }).save();

    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export const getProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        $inc: { view: 1 },
      },
      { new: true }
    )
      .populate(["category", "posts"])
      .exec();

    res.json(product);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      image,
      price,
      salePrice,
      category,
      description,
      brand,
      posts,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        image,
        price,
        salePrice,
        category,
        description,
        brand,
        posts,
      },
      { new: true }
    ).exec();

    res.json(product);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id).exec();

    res.json(product);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

const ProductController = {
  getProducts,
  getProductsHome,
  getRelatedProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};

export default ProductController;
