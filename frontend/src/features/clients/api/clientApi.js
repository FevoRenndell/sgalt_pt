// src/features/clients/api/clientApi.js
import { baseApi } from '@/app/api/baseApi';

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    fetchClients: builder.query({
      query: () => '/clients/all',
      providesTags: (result) =>
        result
          ? [
              ...result.map((client) => ({ type: 'Client', id: client.id })),
              { type: 'Client', id: 'LIST' },
            ]
          : [{ type: 'Client', id: 'LIST' }],
    }),

    fetchClientById: builder.query({
      query: (id) => ({ url: `/clients/${id}` }),
    }),

    createClient: builder.mutation({
      query: (body) => ({
        url: '/clients/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Client', id: 'LIST' },
        { type: 'Client', id: 'SELECTS' },
      ],
    }),

    updateClient: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/clients/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Client', id },
        { type: 'Client', id: 'LIST' },
        { type: 'Client', id: 'SELECTS' },
      ],
    }),

    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/clients/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Client', id },
        { type: 'Client', id: 'LIST' },
        { type: 'Client', id: 'SELECTS' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchClientsQuery,
  useFetchClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApi;
