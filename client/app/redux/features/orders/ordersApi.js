import { apiSlice } from "../api/apiSlice";
import { userLogin } from "../auth/authSlice";

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
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLogin({
                        accessToken: result.data.accessToken,
                        user: result.data.user,
                    }));
                } catch (error) {
                    console.log(error);
                }
            },
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