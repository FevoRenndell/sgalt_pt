// src/features/users/api/userApi.js
import { baseApi } from '@/app/api/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    fetchUsers: builder.query({ //useFetchUsersQuery,
      query: () => '/users/all',
      providesTags: (result) =>
        result
          ? [
              ...result.map((user) => ({ type: 'User', id: user.id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    fetchUserById: builder.query({ //useFetchUserByIdQuery
      query: (id) => ({ url: `/users/${id}` }), // siempre devuelve algo
    }), 
    createUser: builder.mutation({ // useCreateUserMutation
      query: (body) => ({
        url: '/users/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'SELECTS' },
      ],
    }),

    updateUser: builder.mutation({ // useUpdateUserMutation
      query: ({ id, ...data }) => ({
        url: `/users/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'SELECTS' },
      ],
    }),

    deleteUser: builder.mutation({ // useDeleteUserMutation
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'SELECTS' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchUsersQuery,
  useFetchUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
