import api from './api';
import type { ApiResponse } from '../types';

export interface ProductAttribute {
  _id: string;
  name: string;
  code: string;
  type: string;
  values: Array<{ value: string; label: string }>;
}

export interface ProductVariant {
  _id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'discontinued';
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  costPrice?: number;
  category: string;
  attributes?: Array<string | ProductAttribute>;
  variants?: ProductVariant[];
  stock: number;
  status: 'active' | 'inactive' | 'discontinued';
  image?: string;
  images?: string[];
  isActive: boolean;
  createdBy?: any;
  updatedBy?: any;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  sku: string;
  description?: string;
  price: number;
  costPrice?: number;
  category: string;
  attributes?: string[];
  stock?: number;
  image?: string;
  images?: string[];
  status?: 'active' | 'inactive' | 'discontinued';
}

export const getProducts = async (
  page = 1,
  limit = 10,
  search = '',
  category = '',
  status = ''
) => {
  return api.get<ApiResponse<Product[]>>('/products', {
    params: { page, limit, search, category, status },
  });
};

export const createProduct = async (data: ProductFormData) => {
  return api.post<ApiResponse<Product>>('/products', data);
};

export const updateProduct = async (id: string, data: Partial<ProductFormData>) => {
  return api.put<ApiResponse<Product>>(`/products/${id}`, data);
};

export const deleteProduct = async (id: string) => {
  return api.delete<ApiResponse>(`/products/${id}`);
};

export const productService = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
