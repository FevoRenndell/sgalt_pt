// src/features/users/api/userApi.js
import { baseApi } from '@/app/api/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchUsersFilters: builder.query({
      query: () => '/filters/users',
      providesTags: [{ type: 'User', id: 'filters_users' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchUsersFiltersQuery,
} = userApi;
