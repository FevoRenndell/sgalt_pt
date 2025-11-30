// src/features/users/api/userApi.js
import { baseApi } from '@/app/api/baseApi';

export const filterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchRoles: builder.query({
      query: () => 'filters/roles',
      providesTags: [{ type: 'Quote', id: 'filters_quotes' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchRegionsQuery,
 
} = filterApi;
