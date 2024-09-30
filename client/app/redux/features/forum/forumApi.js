import { apiSlice } from "../api/apiSlice";

export const forumApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllPosts: builder.query({
            query: (params) => ({
                url: 'posts',
                method: 'GET',
                params,
                credentials: 'include'
            })
        }),
        createPost: builder.mutation({
            query: ({ title, content, tags }) => ({
                url: 'create-post',
                method: 'POST',
                body: { title, content, tags },
                credentials: 'include'
            }),
        }),
        editPost: builder.mutation({
            query: ({ postId, title, content, tags }) => ({
                url: `posts/${postId}`,
                method: 'PUT',
                body: { title, content, tags },
                credentials: 'include'
            }),
        }),
        deletePost: builder.mutation({
            query: (postId) => ({
                url: `posts/${postId}`,
                method: 'DELETE',
                credentials: 'include'
            }),
        }),
        addComment: builder.mutation({
            query: ({ postId, content }) => ({
                url: 'add-comment-post',
                method: 'PUT',
                body: {  postId, content },
                credentials: 'include'
            }),
        }),

    })
})
export const {
    useGetAllPostsQuery,
    useCreatePostMutation,
    useEditPostMutation,
    useDeletePostMutation,
    useAddCommentMutation
 } = forumApi;