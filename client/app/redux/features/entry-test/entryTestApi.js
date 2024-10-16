import { apiSlice } from "../api/apiSlice";

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
                url: `${testId}/take`,
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

        deleteEntranceTest: builder.mutation({
            query: (id) => ({
                url: `entrance-test/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
        }),

        updateEntranceTest: builder.mutation({
            query: ({ id, ...updateData }) => ({
                url: `entrance-test/${id}`,
                method: 'PUT',
                body: updateData,
                credentials: 'include',
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
    useUpdateEntranceTestMutation,
    useGetEntranceTestByIdQuery,
} = entryTestApi;