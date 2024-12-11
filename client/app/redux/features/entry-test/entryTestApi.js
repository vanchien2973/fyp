import { apiSlice } from "../api/apiSlice";
import { userLogin } from "../auth/authSlice";

export const entryTestApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createEntranceTest: builder.mutation({
            query: (formData) => ({
                url: 'create-test',
                method: 'POST',
                body: formData,
                credentials: 'include',
                formData: true,
            }),
        }),

        takeEntranceTest: builder.mutation({
            query: ({ testId, answers }) => ({
                url: `take-test/${testId}`,
                method: 'POST',
                body: { answers },
                credentials: 'include',
            }),
        }),

        getAllEntranceTests: builder.query({
            query: () => ({
                url: 'all-test',
                method: 'GET',
                credentials: 'include',
            }),
        }),

        getAllTests: builder.query({
            query: () => ({
                url: 'tests',
                method: 'GET',
                credentials: 'include',
            }),
        }),

        deleteEntranceTest: builder.mutation({
            query: (id) => ({
                url: `entrance-test/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
        }),

        updateEntranceTest: builder.mutation({
            query: ({ id, data }) => ({
                url: `entrance-test/${id}`,
                method: 'PUT',
                body: data,
                credentials: 'include',
                formData: true,
            }),
        }),

        getEntranceTestById: builder.query({
            query: (id) => ({
                url: `entrance-test/${id}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
    }),
});

export const {
    useCreateEntranceTestMutation,
    useTakeEntranceTestMutation,
    useGetAllEntranceTestsQuery,
    useDeleteEntranceTestMutation,
    useGetAllTestsQuery,
    useUpdateEntranceTestMutation,
    useGetEntranceTestByIdQuery,
} = entryTestApi;