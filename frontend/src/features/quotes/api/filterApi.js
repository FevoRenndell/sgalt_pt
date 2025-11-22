// src/features/users/api/userApi.js
import { baseApi } from '@/app/api/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchRegions: builder.query({
      query: () => 'quoter/regions',
      providesTags: [{ type: 'Quote', id: 'filters_quotes' }],
    }),
    fetchCityById: builder.query({
      query: (regionId) => `quoter/city/${regionId}`,
      providesTags: [{ type: 'Quote', id: 'filters_quotes' }],
    }),
    fetchCommuneById: builder.query({
      query: (cityId) => `quoter/communes/${cityId}`,
      providesTags: [{ type: 'Quote', id: 'filters_quotes' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchRegionsQuery,
  useFetchCityByIdQuery,  
  useFetchCommuneByIdQuery
} = userApi;
