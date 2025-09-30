import { configureStore } from '@reduxjs/toolkit';
import admin from '../features/admin/adminSlice';
import quote from '../features/quotes/quoteSlice';
import { api } from '../shared/api';

export const store = configureStore({
  reducer: {
    admin,
    quote,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});
