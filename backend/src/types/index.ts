import { Request } from 'express';
import { Document, Types } from 'mongoose';

// User Roles
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

// User Status
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

// User Interface
export interface IUser extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshToken?: string;
  lastLogin?: Date;
  profilePicture?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// Express Request with User
export interface AuthRequest extends Request {
  user?: IUser;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Login Response
export interface LoginResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// Pagination Query
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

// Email Options
export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Activity Log
export interface IActivityLog extends Document {
  user: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Notification
export interface INotification extends Document {
  user: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Permission Interface
export interface IPermission extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  name: string;
  code: string;
  description?: string;
  category: 'users' | 'roles' | 'products' | 'attributes' | 'variants' | 'reports' | 'analytics';
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'export';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Role Interface
export interface IRole extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  permissions: Types.ObjectId[];
  isSystem: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Product Interface
export interface IProduct extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  name: string;
  sku: string;
  description?: string;
  price: number;
  costPrice?: number;
  category: string;
  attributes?: Types.ObjectId[];
  stock: number;
  status: 'active' | 'inactive' | 'discontinued';
  image?: string;
  images?: string[];
  isActive: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Attribute Interface
export interface IAttribute extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

// Variant Interface
export interface IVariant extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  name: string;
  sku: string;
  attributeValues: Array<{
    attribute: Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}
