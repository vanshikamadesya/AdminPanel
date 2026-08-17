import api from './api';
import type { AxiosResponse } from 'axios';
import type { ApiResponse, User, DashboardStats } from '../types';

type UsersListResponse = ApiResponse<{
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}>;

export const getUsers = async (
  page = 1,
  limit = 10,
  search = ''
): Promise<AxiosResponse<UsersListResponse>> => {
  const response = await api.get('/users', {
    params: { page, limit, search },
  });
  return response;
};

export const createUser = async (data: Partial<User> & { password: string }): Promise<AxiosResponse<ApiResponse<User>>> => {
  const response = await api.post('/users', data);
  return response;
};

export const updateUser = async (id: string, data: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> => {
  const response = await api.put(`/users/${id}`, data);
  return response;
};

export const deleteUser = async (id: string): Promise<AxiosResponse<ApiResponse<void>>> => {
  const response = await api.delete(`/users/${id}`);
  return response;
};

export const updateProfile = async (data: Partial<User>): Promise<AxiosResponse<ApiResponse<{ user: User }>>> => {
  const response = await api.put('/users/profile', data);
  return response;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<AxiosResponse<ApiResponse<void>>> => {
  const response = await api.put('/users/change-password', data);
  return response;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/users/stats/dashboard');
  return response.data.data;
};

export const userService = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  changePassword,
  getDashboardStats,
};
