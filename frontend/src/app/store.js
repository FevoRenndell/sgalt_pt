import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import authReducer from '@/features/auth/slice/authSlice';
import quotationReducer from '@/features/quotation/quotationSlice/quotationSlice';
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    quotation: quotationReducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(baseApi.middleware),
});
