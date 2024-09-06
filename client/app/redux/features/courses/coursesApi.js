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
        }),
        deleteCourse: builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `delete-course/${id}`,
                credentials: 'include'
            })
        }),
        editCourse: builder.mutation({
            query: ({ id, data }) => ({
                method: 'PUT',
                url: `edit-course/${id}`,
                body: data,
                credentials: 'include'
            })
        })
    })
})
export const { useCreateCourseMutation, useGetAllCoursesQuery, useDeleteCourseMutation, useEditCourseMutation } = courseApi;