import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ProductAttribute, ProductVariant } from '../../services/productService';

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

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setProducts, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;
