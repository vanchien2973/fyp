import express from "express";
import { isAuthenticated } from "../middlewares/AuthMiddleware";
import { updateToken } from "../controllers/user.controller";
import { addComment, addReply, createPost, deletePost, editPost, getAllPosts, likeComment, likePost, likeReply } from "../controllers/forum.controller";

const forumRouter = express.Router();

forumRouter.post('/create-post', isAuthenticated, createPost);

forumRouter.put('/add-comment-post', isAuthenticated, addComment);

forumRouter.put('/add-reply-comment', isAuthenticated, addReply);

forumRouter.put('/like-post/:postId', isAuthenticated, likePost);

forumRouter.put('/posts/:postId/comments/:commentId', isAuthenticated, likeComment);

forumRouter.put('/posts/:postId/comments/:commentId/replies/:replyId', isAuthenticated, likeReply);

forumRouter.put('/posts/:postId', isAuthenticated, editPost);

forumRouter.delete('/posts/:postId', isAuthenticated, deletePost);

forumRouter.get('/posts', isAuthenticated, getAllPosts);

export default forumRouter;