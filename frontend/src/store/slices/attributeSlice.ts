import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

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

interface AttributeState {
  attributes: Attribute[];
  loading: boolean;
  error: string | null;
}

const initialState: AttributeState = {
  attributes: [],
  loading: false,
  error: null,
};

const attributeSlice = createSlice({
  name: 'attribute',
  initialState,
  reducers: {
    setAttributes: (state, action: PayloadAction<Attribute[]>) => {
      state.attributes = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAttributes, setLoading, setError } = attributeSlice.actions;
export default attributeSlice.reducer;
