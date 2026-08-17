import api from './api';
import type { ApiResponse } from '../types';

export interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  _id: string;
  name: string;
  code: string;
  description?: string;
  category: string;
  resource: string;
  action: string;
  isActive: boolean;
}

export interface RoleFormData {
  name: string;
  description?: string;
  permissions: string[];
}

export const getRoles = async (page = 1, limit = 10, search = '') => {
  return api.get<ApiResponse<Role[]>>('/roles', {
    params: { page, limit, search },
  });
};

export const createRole = async (data: RoleFormData) => {
  return api.post<ApiResponse<Role>>('/roles', data);
};

export const updateRole = async (id: string, data: RoleFormData) => {
  return api.put<ApiResponse<Role>>(`/roles/${id}`, data);
};

export const deleteRole = async (id: string) => {
  return api.delete<ApiResponse>(`/roles/${id}`);
};

export const getPermissions = async (page = 1, limit = 50, category = '', search = '') => {
  return api.get<ApiResponse<Permission[]>>('/permissions', {
    params: { page, limit, category, search },
  });
};

export const roleService = {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
};
