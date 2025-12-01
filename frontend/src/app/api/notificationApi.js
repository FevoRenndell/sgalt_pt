// src/features/users/api/userApi.js  (o donde tengas esto)
import { baseApi } from '@/app/api/baseApi';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
 
    fetchNotificationPopover: builder.query({
      query: (userID) => `/notifications/popover/${userID}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((n) => ({ type: 'Notification', id: n.id })),
              { type: 'Notification', id: 'LIST' },
            ]
          : [{ type: 'Notification', id: 'LIST' }],
    }),

 
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/readed/${id}`,   // ajusta si tu endpoint es otro
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchNotificationPopoverQuery,
  useMarkNotificationAsReadMutation,
} = notificationApi;
