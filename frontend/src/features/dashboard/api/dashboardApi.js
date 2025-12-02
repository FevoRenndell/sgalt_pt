// src/features/dashboard/api/dashboardApi.js
import { baseApi } from '@/app/api/baseApi';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    fetchDashboard1: builder.query({
      query: () => '/dashboard/dash1',
      providesTags: (result) => [{ type: 'Dashboard', id: 'LIST' }],
    }),

  }),
  overrideExisting: false,
});

export const {
  useFetchDashboard1Query,
} = dashboardApi;
