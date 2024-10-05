import { apiSlice } from "../api/apiSlice";

export const notificationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserNotifications: builder.query({
            query: () => ({
                method: 'GET',
                url: 'user-notifications',
                credentials: 'include'
            })
        }),
        getSystemNotifications: builder.query({
            query: () => ({
                method: 'GET',
                url: 'system-notifications',
                credentials: 'include'
            })
        }),
        updateNotificationStatus: builder.mutation({
            query: (id) => ({
                method: 'PUT',
                url: `update-notification/${id}`,
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

export const { 
    useGetUserNotificationsQuery, 
    useGetSystemNotificationsQuery, 
    useUpdateNotificationStatusMutation, 
    useDeleteNotificationMutation 
} = notificationsApi;