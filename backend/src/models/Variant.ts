import mongoose, { Schema } from 'mongoose';
import { IVariant } from '../types';

const variantSchema = new Schema<IVariant>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Variant name is required'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'Variant SKU is required'],
      unique: true,
      trim: true,
    },
    attributeValues: [
      {
        attribute: {
          type: Schema.Types.ObjectId,
          ref: 'Attribute',
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    costPrice: {
      type: Number,
    },
    discountPrice: {
      type: Number,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'discontinued'],
      default: 'active',
    },
    image: {
      type: String,
    },
    images: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IVariant>('Variant', variantSchema);
