import api from './api';
import type { ApiResponse } from '../types';

export interface Variant {
  _id: string;
  product: string;
  name: string;
  sku: string;
  attributeValues: Array<{
    attribute: string;
    value: string;
  }>;
  price: number;
  costPrice?: number;
  discountPrice?: number;
  stock: number;
  status: 'active' | 'inactive' | 'discontinued';
  image?: string;
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VariantFormData {
  product: string;
  name: string;
  sku: string;
  attributeValues?: Array<{
    attribute: string;
    value: string;
  }>;
  price: number;
  costPrice?: number;
  discountPrice?: number;
  stock?: number;
  image?: string;
  images?: string[];
  status?: 'active' | 'inactive' | 'discontinued';
}

export const getVariants = async (page = 1, limit = 10, search = '', product = '', status = '') => {
  return api.get<ApiResponse<Variant[]>>('/variants', {
    params: { page, limit, search, product, status },
  });
};

export const createVariant = async (data: VariantFormData) => {
  return api.post<ApiResponse<Variant>>('/variants', data);
};

export const updateVariant = async (id: string, data: Partial<VariantFormData>) => {
  return api.put<ApiResponse<Variant>>(`/variants/${id}`, data);
};

export const deleteVariant = async (id: string) => {
  return api.delete<ApiResponse>(`/variants/${id}`);
};

export const variantService = {
  getVariants,
  createVariant,
  updateVariant,
  deleteVariant,
};
