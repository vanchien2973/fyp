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
        }),
        getAllCourses: builder.query({
            query: () => ({
                method: 'GET',
                url: 'get-courses',
                credentials: 'include'
            })
        })
    })
})
export const { useCreateCourseMutation, useGetAllCoursesQuery } = courseApi;