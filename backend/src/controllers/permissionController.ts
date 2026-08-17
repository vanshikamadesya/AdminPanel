import { Response } from 'express';
import Permission from '../models/Permission';
import { AuthRequest, ApiResponse } from '../types';
import { validationResult } from 'express-validator';

// Get all permissions
export const getAllPermissions = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query: any = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Permission.countDocuments(query);
    const permissions = await Permission.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ category: 1, resource: 1, action: 1 });

    return res.status(200).json({
      success: true,
      data: permissions,
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
      message: 'Error fetching permissions',
      errors: error.message,
    });
  }
};

// Get permission by ID
export const getPermissionById = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const permission = await Permission.findById(id);

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: permission,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching permission',
      errors: error.message,
    });
  }
};

// Create permission
export const createPermission = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, code, description, category, resource, action } = req.body;

    const permission = new Permission({
      name,
      code,
      description,
      category,
      resource,
      action,
    });

    await permission.save();

    return res.status(201).json({
      success: true,
      message: 'Permission created successfully',
      data: permission,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error creating permission',
      errors: error.message,
    });
  }
};

// Update permission
export const updatePermission = async (req: AuthRequest, res: Response<ApiResponse>) => {
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
    const { name, description, category, resource, action, isActive } = req.body;

    const permission = await Permission.findByIdAndUpdate(
      id,
      { name, description, category, resource, action, isActive },
      { new: true, runValidators: true }
    );

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Permission updated successfully',
      data: permission,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error updating permission',
      errors: error.message,
    });
  }
};

// Delete permission
export const deletePermission = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const permission = await Permission.findByIdAndDelete(id);

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Permission deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting permission',
      errors: error.message,
    });
  }
};
