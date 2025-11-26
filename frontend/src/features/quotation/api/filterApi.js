// src/features/users/api/userApi.js
import { baseApi } from '@/app/api/baseApi';

export const filterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fethQuotationFilter: builder.query({
      query: () => 'filters/quotation',
      providesTags: [{ type: 'Quuotation', id: 'filters_quotation' }],
    }),
 
  }),
  overrideExisting: false,
});

export const {
  useFethQuotationFilterQuery,
} = filterApi;
