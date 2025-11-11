import { baseApi } from '@/app/api/baseApi';
import { setCredentials, logout } from '../slice/authSlice';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password_hash, remember }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { email, password_hash },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled; // { token, user? }
          dispatch(
            setCredentials({
              token: data.token,
              user: data.user || null,
              remember: arg.remember,
            }),
          );
        } catch {
          // lo maneja el componente
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
