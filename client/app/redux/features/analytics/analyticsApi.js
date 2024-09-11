import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoursesAnalytics: builder.query({
            query: () => ({
                method: 'GET',
                url: 'get-courses-analytics',
                credentials: 'include'
            })
        })
    })
});

export const { useGetCoursesAnalyticsQuery } = analyticsApi; 