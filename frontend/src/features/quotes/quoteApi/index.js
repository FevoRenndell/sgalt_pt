import { api } from '../../../shared/api';

export const quotesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getQuotes: builder.query({
      query: () => 'quotes',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Quote', id })),
              { type: 'Quote', id: 'LIST' },
            ]
          : [{ type: 'Quote', id: 'LIST' }],
    }),
    createQuote: builder.mutation({
      query: (body) => ({ url: 'quotes', method: 'POST', body }),
      invalidatesTags: [{ type: 'Quote', id: 'LIST' }],
    }),
  }),
});

export const { useGetQuotesQuery, useCreateQuoteMutation } = quotesApi;
