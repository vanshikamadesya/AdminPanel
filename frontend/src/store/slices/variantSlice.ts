import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

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

interface VariantState {
  variants: Variant[];
  loading: boolean;
  error: string | null;
}

const initialState: VariantState = {
  variants: [],
  loading: false,
  error: null,
};

const variantSlice = createSlice({
  name: 'variant',
  initialState,
  reducers: {
    setVariants: (state, action: PayloadAction<Variant[]>) => {
      state.variants = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setVariants, setLoading, setError } = variantSlice.actions;
export default variantSlice.reducer;
