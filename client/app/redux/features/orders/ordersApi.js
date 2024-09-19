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
        getStripePushlishableKey: builder.query({
            query: () => ({
                method: 'GET',
                url: 'payment/stripepublishablekey',
                credentials: 'include'
            })
        }),
        createPaymentIntent: builder.mutation({
            query: (amount) => ({
                method: 'POST',
                url: 'payment',
                body: { amount },
                credentials: 'include'
            })
        }),
        createOrder: builder.mutation({
            query: ({ courseId, paymentInfor }) => ({
                method: 'POST',
                url: 'create-order',
                body: { courseId, paymentInfor },
                credentials: 'include'
            })
        })
    })
});

export const { useGetAllInvoicesQuery, useGetStripePushlishableKeyQuery, useCreatePaymentIntentMutation, useCreateOrderMutation } = analyticsApi; 