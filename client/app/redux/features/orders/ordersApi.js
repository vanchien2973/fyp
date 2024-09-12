import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllInvoices: builder.query({
            query: () => ({
                method: 'GET',
                url: 'get-all-orders',
                credentials: 'include'
            })
        }),
    })
});

export const { useGetAllInvoicesQuery } = analyticsApi; 