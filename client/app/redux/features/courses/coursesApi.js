import { apiSlice } from "../api/apiSlice";


export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: (data) => ({
                method: 'POST',
                url: 'create-course',
                body: data,
                credentials: 'include'
            })
        })
    })
})
export const { useCreateCourseMutation } = courseApi;