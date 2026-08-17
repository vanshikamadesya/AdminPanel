import { Response } from 'express';
import Attribute from '../models/Attribute';
import { AuthRequest, ApiResponse } from '../types';
import { validationResult } from 'express-validator';

// Get all attributes
export const getAllAttributes = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query: any = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Attribute.countDocuments(query);
    const attributes = await Attribute.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ displayOrder: 1, name: 1 });

    return res.status(200).json({
      success: true,
      data: attributes,
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
      message: 'Error fetching attributes',
      errors: error.message,
    });
  }
};

// Get attribute by ID
export const getAttributeById = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const attribute = await Attribute.findById(id);

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Attribute not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: attribute,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching attribute',
      errors: error.message,
    });
  }
};

// Create attribute
export const createAttribute = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, code, description, type, values, isRequired, isFilterable, displayOrder } =
      req.body;

    const attribute = new Attribute({
      name,
      code,
      description,
      type,
      values: values || [],
      isRequired: isRequired || false,
      isFilterable: isFilterable !== false,
      displayOrder: displayOrder || 0,
    });

    await attribute.save();

    return res.status(201).json({
      success: true,
      message: 'Attribute created successfully',
      data: attribute,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error creating attribute',
      errors: error.message,
    });
  }
};

// Update attribute
export const updateAttribute = async (req: AuthRequest, res: Response<ApiResponse>) => {
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
    const { name, description, type, values, isRequired, isFilterable, isActive, displayOrder } =
      req.body;

    const attribute = await Attribute.findByIdAndUpdate(
      id,
      {
        name,
        description,
        type,
        values: values || [],
        isRequired,
        isFilterable,
        isActive,
        displayOrder,
      },
      { new: true, runValidators: true }
    );

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Attribute not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Attribute updated successfully',
      data: attribute,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error updating attribute',
      errors: error.message,
    });
  }
};

// Delete attribute
export const deleteAttribute = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const attribute = await Attribute.findByIdAndDelete(id);

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Attribute not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Attribute deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting attribute',
      errors: error.message,
    });
  }
};
