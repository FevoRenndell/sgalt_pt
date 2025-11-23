// src/features/users/api/userApi.js
import { baseApi } from '@/app/api/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createQuoteRequest: builder.mutation({  
      query: (body) => ({
        url: '/quoter/create_quotation',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Quote', id: 'LIST' },
        { type: 'Quote', id: 'SELECTS' },
      ],
    }),

 
  }),
  overrideExisting: false,
});

export const {
  useCreateQuoteRequestMutation,
} = userApi;
