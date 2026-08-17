import { Response } from 'express';
import Role from '../models/Role';
import { AuthRequest, ApiResponse } from '../types';
import { validationResult } from 'express-validator';

// Get all roles
export const getAllRoles = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query: any = { isActive: true };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const total = await Role.countDocuments(query);
    const roles = await Role.find(query)
      .populate('permissions')
      .skip(skip)
      .limit(Number(limit))
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: roles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching roles',
      errors: error.message,
    });
  }
};

// Get role by ID
export const getRoleById = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id).populate('permissions');

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching role',
      errors: error.message,
    });
  }
};

// Create role
export const createRole = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, description, permissions } = req.body;

    const role = new Role({
      name,
      description,
      permissions: permissions || [],
      isSystem: false,
    });

    await role.save();
    await role.populate('permissions');

    return res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error creating role',
      errors: error.message,
    });
  }
};

// Update role
export const updateRole = async (req: AuthRequest, res: Response<ApiResponse>) => {
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
    const { name, description, permissions, isActive } = req.body;

    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    if (role.isSystem) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update system roles',
      });
    }

    role.name = name || role.name;
    role.description = description || role.description;
    role.permissions = permissions || role.permissions;
    role.isActive = isActive !== undefined ? isActive : role.isActive;

    await role.save();
    await role.populate('permissions');

    return res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: role,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error updating role',
      errors: error.message,
    });
  }
};

// Delete role
export const deleteRole = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    if (role.isSystem) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete system roles',
      });
    }

    await Role.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting role',
      errors: error.message,
    });
  }
};
