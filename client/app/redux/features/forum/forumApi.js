import { apiSlice } from "../api/apiSlice";

export const forumApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllPosts: builder.query({
            query: (params) => ({
                url: 'posts',
                method: 'GET',
                params,
                credentials: 'include',
            }),
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
                body: { postId, content },
                credentials: 'include'
            }),
        }),
        addReply: builder.mutation({
            query: ({ postId, commentId, content }) => ({
                url: 'add-reply-comment',
                method: 'PUT',
                body: { postId, commentId, content },
                credentials: 'include'
            }),
        }),
        likePost: builder.mutation({
            query: ({ postId }) => ({
                url: `like-post/${postId}`,
                method: 'PUT',
                credentials: 'include'
            }),
        }),
        likeComment: builder.mutation({
            query: ({ postId, commentId }) => ({
               url: `posts/${postId}/comments/${commentId}`,
                method: 'PUT',
                credentials: 'include'
            }),
        }),
        likeReply: builder.mutation({
            query: ({ postId, commentId, replyId }) => ({
               url: `posts/${postId}/comments/${commentId}/replies/${replyId}`,
                method: 'PUT',
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
    useAddCommentMutation,
    useAddReplyMutation,
    useLikePostMutation,
    useLikeCommentMutation,
    useLikeReplyMutation
} = forumApi;