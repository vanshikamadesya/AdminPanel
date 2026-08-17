import { Response } from 'express';
import Variant from '../models/Variant';
import { AuthRequest, ApiResponse } from '../types';
import { validationResult } from 'express-validator';

// Get all variants
export const getAllVariants = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { page = 1, limit = 10, search, product, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query: any = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    if (product) {
      query.product = product;
    }

    if (status) {
      query.status = status;
    }

    const total = await Variant.countDocuments(query);
    const variants = await Variant.find(query)
      .populate('product', 'name sku')
      .populate('attributeValues.attribute')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: variants,
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
      message: 'Error fetching variants',
      errors: error.message,
    });
  }
};

// Get variant by ID
export const getVariantById = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const variant = await Variant.findById(id)
      .populate('product')
      .populate('attributeValues.attribute');

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Variant not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: variant,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching variant',
      errors: error.message,
    });
  }
};

// Create variant
export const createVariant = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const {
      product,
      name,
      sku,
      attributeValues,
      price,
      costPrice,
      discountPrice,
      stock,
      image,
      images,
    } = req.body;

    const variant = new Variant({
      product,
      name,
      sku,
      attributeValues: attributeValues || [],
      price,
      costPrice,
      discountPrice,
      stock: stock || 0,
      image,
      images: images || [],
    });

    await variant.save();
    await variant.populate('product');
    await variant.populate('attributeValues.attribute');

    return res.status(201).json({
      success: true,
      message: 'Variant created successfully',
      data: variant,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error creating variant',
      errors: error.message,
    });
  }
};

// Update variant
export const updateVariant = async (req: AuthRequest, res: Response<ApiResponse>) => {
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
      attributeValues,
      price,
      costPrice,
      discountPrice,
      stock,
      status,
      image,
      images,
      isActive,
    } = req.body;

    const variant = await Variant.findByIdAndUpdate(
      id,
      {
        name,
        attributeValues: attributeValues || [],
        price,
        costPrice,
        discountPrice,
        stock,
        status,
        image,
        images: images || [],
        isActive,
      },
      { new: true, runValidators: true }
    )
      .populate('product')
      .populate('attributeValues.attribute');

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Variant not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Variant updated successfully',
      data: variant,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error updating variant',
      errors: error.message,
    });
  }
};

// Delete variant
export const deleteVariant = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const variant = await Variant.findByIdAndDelete(id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Variant not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Variant deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting variant',
      errors: error.message,
    });
  }
};
