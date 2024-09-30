import express from "express";
import { isAuthenticated } from "../middlewares/AuthMiddleware";
import { updateToken } from "../controllers/user.controller";
import { addComment, addReply, createPost, deletePost, editPost, getAllPosts, likeComment, likePost, likeReply } from "../controllers/forum.controller";

const forumRouter = express.Router();

forumRouter.post('/create-post', updateToken, isAuthenticated, createPost);

forumRouter.put('/add-comment-post', updateToken, isAuthenticated, addComment);

forumRouter.put('/add-reply-comment', updateToken, isAuthenticated, addReply);

forumRouter.put('/like-post/:postId', updateToken, isAuthenticated, likePost);

forumRouter.put('/posts/:postId/comments/:commentId', updateToken, isAuthenticated, likeComment);

forumRouter.put('/posts/:postId/comments/:commentId/replies/:replyId', updateToken, isAuthenticated, likeReply);

forumRouter.put('/posts/:postId', updateToken, isAuthenticated, editPost);

forumRouter.delete('/posts/:postId', updateToken, isAuthenticated, deletePost);

forumRouter.get('/posts', updateToken, isAuthenticated, getAllPosts);

export default forumRouter;