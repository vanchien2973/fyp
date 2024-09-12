import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoursesAnalytics: builder.query({
            query: () => ({
                method: 'GET',
                url: 'get-courses-analytics',
                credentials: 'include'
            })
        }),
        getOrdersAnalytics: builder.query({
            query: () => ({
                method: 'GET',
                url: 'get-orders-analytics',
                credentials: 'include'
            })
        }),
        getUsersAnalytics: builder.query({
            query: () => ({
                method: 'GET',
                url: 'get-users-analytics',
                credentials: 'include'
            })
        })
    })
});

export const { useGetCoursesAnalyticsQuery, useGetOrdersAnalyticsQuery, useGetUsersAnalyticsQuery } = analyticsApi; 