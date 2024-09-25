import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLogin } from "../auth/authSlice";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ 
        baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
    }),
    endpoints: (builder) => ({
        refreshToken: builder.query({
            query: () => ({
                url: "refresh",
                method: "GET",
                credentials: "include",
            })
        }),
        loadUser: builder.query({
            query: () => ({
                url: "me",
                method: "GET",
                credentials: "include",
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLogin({
                        accessToken: result.data.accessToken,
                        user: result.data.user,
                    }));
                } catch (error) {
                   console.log(error)
                }
            },
        }),
    }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;