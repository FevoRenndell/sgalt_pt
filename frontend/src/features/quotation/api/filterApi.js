// src/features/users/api/userApi.js
import { baseApi } from '@/app/api/baseApi';

export const filterApi = baseApi.injectEndpoints({
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
    fetchClientByRut: builder.query({
      query: (rut) => `quoter/rut/${rut}`,
      providesTags: [{ type: 'Client', id: 'by_rut' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchRegionsQuery,
  useFetchCityByIdQuery,  
  useFetchCommuneByIdQuery,
  useFetchClientByRutQuery ,
} = filterApi;
