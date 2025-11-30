// src/features/clients/api/roleApi.js
import { baseApi } from '@/app/api/baseApi';

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    fetchRoles: builder.query({
      query: () => '/roles/all',
      providesTags: (result) =>
        result
          ? [
              ...result.map((role) => ({ type: 'Rol', id: role.id })),
              { type: 'Rol', id: 'LIST' },
            ]
          : [{ type: 'Rol', id: 'LIST' }],
    }),

    fetchRolById: builder.query({
      query: (id) => ({ url: `/roles/${id}` }),
    }),

    createRol: builder.mutation({
      query: (body) => ({
        url: '/roles/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Rol', id: 'LIST' },
        { type: 'Rol', id: 'SELECTS' },
      ],
    }),

    updateRol: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/roles/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Rol', id },
        { type: 'Rol', id: 'LIST' },
        { type: 'Rol', id: 'SELECTS' },
      ],
    }),

  }),
  overrideExisting: false,
});

export const {
  useFetchRolesQuery,
  useFetchRolByIdQuery,
  useCreateRolMutation,
  useUpdateRolMutation,
} = roleApi;
