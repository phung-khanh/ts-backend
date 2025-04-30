import * as ProductService from "../services/product.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getProducts = asyncHandler(async (req, res) => {
  try {
    const { search } = req.query;
    const products = await ProductService.getProducts(search as string);
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
    const products = await ProductService.getProductsHome();
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
    const productsRelated = await ProductService.getRelatedProducts(id);
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
    const product = await ProductService.createProduct(req.body);
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
    const product = await ProductService.getProduct(id);
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
    const product = await ProductService.updateProduct(id, req.body);
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
    const product = await ProductService.deleteProduct(id);
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
