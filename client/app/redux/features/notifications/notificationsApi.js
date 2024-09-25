import { apiSlice } from "../api/apiSlice";

export const notificationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllNotifications: builder.query({
            query: () => ({
                method: 'GET',
                url: 'get-all-notifications',
                credentials: 'include'
            })
        }),
        updateNotificationStatus: builder.mutation({
            query: (id) => ({
                method: 'PUT',
                url: `update-notification-status/${id}`,
                credentials: 'include'
            })
        }),
        deleteNotification: builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `delete-notification/${id}`,
                credentials: 'include'
            })
        })
        
    })
});

export const { useGetAllNotificationsQuery, useUpdateNotificationStatusMutation, useDeleteNotificationMutation } = notificationsApi; 