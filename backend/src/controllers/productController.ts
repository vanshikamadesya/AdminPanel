import { Response } from 'express';
import Product from '../models/Product';
import { AuthRequest, ApiResponse } from '../types';
import { validationResult } from 'express-validator';

// Get all products
export const getAllProducts = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { page = 1, limit = 10, search, category, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query: any = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('attributes')
      .populate('variants', 'name sku price stock status attributeValues')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching products',
      errors: error.message,
    });
  }
};

// Get product by ID
export const getProductById = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate('attributes')
      .populate('variants', 'name sku price stock status attributeValues')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching product',
      errors: error.message,
    });
  }
};

// Create product
export const createProduct = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, sku, description, price, costPrice, category, attributes, stock, image, images } =
      req.body;

    const product = new Product({
      name,
      sku,
      description,
      price,
      costPrice,
      category,
      attributes: attributes || [],
      stock: stock || 0,
      image,
      images: images || [],
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    });

    await product.save();
    await product.populate('attributes');

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error creating product',
      errors: error.message,
    });
  }
};

// Update product
export const updateProduct = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const {
      name,
      description,
      price,
      costPrice,
      category,
      attributes,
      stock,
      status,
      image,
      images,
      isActive,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        costPrice,
        category,
        attributes: attributes || [],
        stock,
        status,
        image,
        images: images || [],
        isActive,
        updatedBy: req.user?._id,
      },
      { new: true, runValidators: true }
    ).populate('attributes');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error updating product',
      errors: error.message,
    });
  }
};

// Delete product
export const deleteProduct = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting product',
      errors: error.message,
    });
  }
};
