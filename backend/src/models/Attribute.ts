import mongoose, { Schema } from 'mongoose';
import { IAttribute } from '../types';

const attributeSchema = new Schema<IAttribute>(
  {
    name: {
      type: String,
      required: [true, 'Attribute name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Attribute name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Attribute code is required'],
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['text', 'dropdown', 'checkbox', 'color', 'size'],
      default: 'text',
    },
    values: [
      {
        value: {
          type: String,
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
      },
    ],
    isRequired: {
      type: Boolean,
      default: false,
    },
    isFilterable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAttribute>('Attribute', attributeSchema);
