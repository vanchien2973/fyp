import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateAvatar: builder.mutation({
            query: ({ avatar }) => ({
                url: "update-user-avatar",
                method: "PUT",
                body: { avatar },
                credentials: "include",
            })
        }),
        editProfile: builder.mutation({
            query: ({ name, phoneNumber }) => ({
                url: "update-user-profile",
                method: "PUT",
                body: { name, phoneNumber },
                credentials: "include",
            })
        }),
        updatePassword: builder.mutation({
            query: ({ currentPassword, newPassword }) => ({
                url: "update-user-password",
                method: "PUT",
                body: { currentPassword, newPassword },
                credentials: "include",
            })
        })
    })
});

export const { useUpdateAvatarMutation, useEditProfileMutation, useUpdatePasswordMutation } = userApi;
