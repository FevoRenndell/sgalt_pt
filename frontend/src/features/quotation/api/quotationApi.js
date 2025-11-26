// src/features/quotation/api/quotationApi.js
import { baseApi } from '@/app/api/baseApi';

export const quotationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createQuotation: builder.mutation({ // useCreateQuotationMutation
      query: (body) => ({
        url: '/quotation/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Quotation', id: 'LIST' },
        { type: 'Quotation', id: 'SELECTS' },
      ],
    }),



  }),
  overrideExisting: false,
});

export const {
  useCreateQuotationMutation
} = quotationApi;
