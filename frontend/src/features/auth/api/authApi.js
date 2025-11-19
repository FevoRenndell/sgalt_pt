import { baseApi } from '@/app/api/baseApi';
import { setCredentials, logout } from '../slice/authSlice';

/**
 * authApi
 * --------------------------------------------------------------
 * Endpoints de autenticación manejados con RTK Query.
 *
 * LOGIN:
 * - Envía email y contraseña al backend.
 * - Si responde correctamente, guarda token y usuario en Redux
 *   mediante setCredentials().
 *
 * ME:
 * - Verifica si el token actual sigue siendo válido llamando a /auth/me.
 * - Actualiza solo los datos del usuario sin reemplazar el token.
 *   (El backend no devuelve token en este endpoint.)
 *
 * LOGOUT:
 * - Llama al endpoint de cierre de sesión.
 * - Limpia el estado de autenticación en Redux con logout().
 *
 * Este módulo centraliza toda la lógica de autenticación que depende
 * del servidor y trabaja directamente con el slice del auth.
 * --------------------------------------------------------------
 */

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
    me: builder.mutation({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
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

export const { useLoginMutation, useMeMutation, useLogoutMutation } = authApi;
