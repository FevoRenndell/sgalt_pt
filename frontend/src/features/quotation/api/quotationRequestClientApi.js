import { baseApi } from '@/app/api/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createQuoteRequest: builder.mutation({ // useCreateQuoteRequestMutation
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
    getPublicQuotationById: builder.query({ // useGetPublicQuotationByIdQuery
      query: ({ id, token }) => ({
        url: `/quoter/quotation/${id}?token=${token}`,
        method: 'GET',
      }),
      providesTags: [{ type: 'Quote', id: 'DETAIL' }],
    }),
    acceptQuotation: builder.mutation({ // useAcceptQuotationMutation
      query: (body) => ({
        url: `/quoter/quotation/accept`,
        body,
        method: 'POST',
        // headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: [{ type: 'Quote', id: 'DETAIL' }],
    }),
    rejectQuotation: builder.mutation({ //useRejectQuotationMutation
      query: (body) => ({
        url: `/quoter/quotation/reject`,
        body,
        method: 'POST',
        // headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: [{ type: 'Quote', id: 'DETAIL' }],
    }),

  }),
});

export const {
  useCreateQuoteRequestMutation,
  useGetPublicQuotationByIdQuery,
  useAcceptQuotationMutation,
  useRejectQuotationMutation,
} = userApi;
