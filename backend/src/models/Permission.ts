import mongoose, { Schema } from 'mongoose';
import { IPermission } from '../types';

const permissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      required: [true, 'Permission name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Permission code is required'],
      unique: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['users', 'roles', 'products', 'attributes', 'variants', 'reports', 'analytics'],
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ['create', 'read', 'update', 'delete', 'export'],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPermission>('Permission', permissionSchema);
