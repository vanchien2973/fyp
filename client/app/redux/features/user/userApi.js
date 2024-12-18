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
        }),
        getAllUsers: builder.query({
            query: () => ({
                method: 'GET',
                url: 'get-all-users',
                credentials: 'include'
            })
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `delete-user/${id}`,
                credentials: 'include'
            })
        }),
        updateRole: builder.mutation({
            query: ({ id, role }) => ({
                url: "assign-user-role",
                method: "PUT",
                body: { id, role },
                credentials: "include",
            })
        }),
    })
});

export const { useUpdateAvatarMutation, useEditProfileMutation, useUpdatePasswordMutation, useGetAllUsersQuery, useDeleteUserMutation, useUpdateRoleMutation } = userApi;
