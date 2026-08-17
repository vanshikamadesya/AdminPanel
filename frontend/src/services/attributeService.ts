import api from './api';
import type { ApiResponse } from '../types';

export interface Attribute {
  _id: string;
  name: string;
  code: string;
  description?: string;
  type: 'text' | 'dropdown' | 'checkbox' | 'color' | 'size';
  values: Array<{
    value: string;
    label: string;
  }>;
  isRequired: boolean;
  isFilterable: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AttributeFormData {
  name: string;
  code: string;
  description?: string;
  type: 'text' | 'dropdown' | 'checkbox' | 'color' | 'size';
  values?: Array<{
    value: string;
    label: string;
  }>;
  isRequired?: boolean;
  isFilterable?: boolean;
  displayOrder?: number;
}

export const getAttributes = async (page = 1, limit = 10, search = '') => {
  return api.get<ApiResponse<Attribute[]>>('/attributes', {
    params: { page, limit, search },
  });
};

export const createAttribute = async (data: AttributeFormData) => {
  return api.post<ApiResponse<Attribute>>('/attributes', data);
};

export const updateAttribute = async (id: string, data: Partial<AttributeFormData>) => {
  return api.put<ApiResponse<Attribute>>(`/attributes/${id}`, data);
};

export const deleteAttribute = async (id: string) => {
  return api.delete<ApiResponse>(`/attributes/${id}`);
};

export const attributeService = {
  getAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute,
};
