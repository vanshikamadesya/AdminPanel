import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import roleReducer from './slices/roleSlice';
import productReducer from './slices/productSlice';
import attributeReducer from './slices/attributeSlice';
import variantReducer from './slices/variantSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    role: roleReducer,
    product: productReducer,
    attribute: attributeReducer,
    variant: variantReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
