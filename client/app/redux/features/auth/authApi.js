import { apiSlice } from "../api/apiSlice";
import { userLogin, userLogout, userSignUp } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: 'register',
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userSignUp({
                            token: result.data.activationToken,
                        })
                    );
                } catch (error) {
                    console.error(error);
                }
            },
        }),
        activation: builder.mutation({
            query: ({ activation_token, activation_code }) => ({
                url: 'activate',
                method: 'POST',
                body: { activation_token, activation_code },
            }),
        }),
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: 'login',
                method: 'POST',
                body: { email, password },
                credentials: 'include',
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
        socialAuth: builder.mutation({
            query: ({ email, name, avatar }) => ({
                url: 'social-auth',
                method: 'POST',
                body: { email, name, avatar },
                credentials: 'include',
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
        logout: builder.query({
            query: () => ({
                url: 'logout',
                method: 'GET',
                credentials: 'include',
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    dispatch(userLogout());
                } catch (error) {
                    console.log(error);
                }
            },
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutQuery, useSocialAuthMutation, useActivationMutation } = authApi;
