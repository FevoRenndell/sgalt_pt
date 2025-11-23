// src/features/quotationRequest/api/quotationRequestApi.js
import { baseApi } from '@/app/api/baseApi';

export const quotationRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchQuotationRequests: builder.query({ //useFetchQuotationRequestsQuerys,
      query: () => '/quotation_requests/all',
      providesTags: (result) =>
        result
          ? [
              ...result.map((quotationRequest) => ({ type: 'QuotationRequest', id: quotationRequest.id })),
              { type: 'QuotationRequest', id: 'LIST' },
            ]
          : [{ type: 'QuotationRequest', id: 'LIST' }],
    }),
    fetchQuotationRequestById: builder.query({ //useFetchQuotationRequestByIdQuery
      query: (id) => ({ url: `/quotation_requests/${id}` }), // siempre devuelve algo
    }), 
    createQuotationRequest: builder.mutation({ // useCreateQuotationRequestMutation
      query: (body) => ({
        url: '/quotation_requests/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'QuotationRequest', id: 'LIST' },
        { type: 'QuotationRequest', id: 'SELECTS' },
      ],
    }),
    updateQuotationRequest: builder.mutation({ // useUpdateQuotationRequestMutation
      query: ({ id, ...data }) => ({
        url: `/quotation_requests/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'QuotationRequest', id },
        { type: 'QuotationRequest', id: 'LIST' },
        { type: 'QuotationRequest', id: 'SELECTS' },
      ],
    }),
    deleteQuotationRequest: builder.mutation({ // useDeleteQuotationRequestMutation
      query: (id) => ({
        url: `/quotation_requests/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'QuotationRequest', id },
        { type: 'QuotationRequest', id: 'LIST' },
        { type: 'QuotationRequest', id: 'SELECTS' },
      ],
    }),
    updateQuotationRequestSaveReview: builder.mutation({ // useUpdateQuotationRequestSaveReviewMutation: builder.mutation({ // useUpdateQuotationRequestSaveReviewMutation
      query: ({ id, ...data }) => ({
        url: `/quotation_requests/save_review/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'QuotationRequest', id },
        { type: 'QuotationRequest', id: 'LIST' },
        { type: 'QuotationRequest', id: 'SELECTS' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchQuotationRequestsQuery,
  useFetchQuotationRequestByIdQuery,
  useCreateQuotationRequestMutation,
  useUpdateQuotationRequestMutation,
  useDeleteQuotationRequestMutation,
  useUpdateQuotationRequestSaveReviewMutation
} = quotationRequestApi;
