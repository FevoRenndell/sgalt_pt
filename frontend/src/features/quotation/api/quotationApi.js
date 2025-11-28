// src/features/quotation/api/quotationApi.js
import { baseApi } from '@/app/api/baseApi';

export const quotationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchQuotations: builder.query({ //useFetchQuotationQuery,
      query: () => '/quotation/all',
      providesTags: (result) =>
        result
          ? [
              ...result.map((quotation) => ({ type: 'Quotation', id: quotation.id })),
              { type: 'Quotation', id: 'LIST' },
            ]
          : [{ type: 'Quotation', id: 'LIST' }],
    }),
    fetchQuotationById: builder.query({ //useFetchQuotationByIdQuery
      query: (id) => ({ url: `/quotation/${id}` }), // siempre devuelve algo
    }), 
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
  useFetchQuotationsQuery,
  useFetchQuotationByIdQuery,
  useCreateQuotationMutation
} = quotationApi;
