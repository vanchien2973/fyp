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
                url: 'get-all-courses',
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
        }),
        getAllUserCourses: builder.query({
            query: () => ({
                method: 'GET',
                url: 'get-courses',
                credentials: 'include'
            })
        }),
        getCourseDetail: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `get-course/${id}`,
                credentials: 'include'
            })
        }),
        getCourseContent: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/get-course-content/${id}`,
                credentials: 'include'
            })
        }),
        createNewQuestion: builder.mutation({
            query: ({ question, courseId, contentId }) => ({
                method: 'PUT',
                url: 'add-question',
                body: { question, courseId, contentId },
                credentials: 'include'
            })
        }),
        addAnswerQuestion: builder.mutation({
            query: ({ answer, courseId, contentId, questionId }) => ({
                method: 'PUT',
                url: 'add-answer',
                body: { answer, courseId, contentId, questionId },
                credentials: 'include'
            })
        }),
        addReviewInCourse: builder.mutation({
            query: ({ review, rating, courseId }) => ({
                method: 'PUT',
                url: `add-review/${courseId}`,
                body: { review, rating },
                credentials: 'include'
            })
        }),
        addReplyReviewInCourse: builder.mutation({
            query: ({ comment, courseId, reviewId }) => ({
                method: 'PUT',
                url: 'add-reply-review',
                body: { comment, courseId, reviewId },
                credentials: 'include'
            })
        }),
    })
})
export const { 
    useCreateCourseMutation, 
    useGetAllCoursesQuery, 
    useDeleteCourseMutation, 
    useEditCourseMutation, 
    useGetAllUserCoursesQuery, 
    useGetCourseDetailQuery, 
    useGetCourseContentQuery,
    useCreateNewQuestionMutation,
    useAddAnswerQuestionMutation,
    useAddReviewInCourseMutation,
    useAddReplyReviewInCourseMutation
} = courseApi;