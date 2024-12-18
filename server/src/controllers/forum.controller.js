import CatchAsyncError from "../middlewares/CatchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import UserModel from "../models/user.model";
import ForumModel from "../models/forum.model";
import { createNotification } from "./notification.controller";
import NotificationModel from "../models/notification.model";
import { io } from "../../socketServer";

// Create post in Forum
export const createPost = CatchAsyncError(async (req, res, next) => {
    try {
        const { title, content, tags } = req.body;
        const userId = req.user._id;

        // Fetch user details
        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Create new forum post
        const newPost = new ForumModel({
            title,
            content,
            user: userId,
            tags,
            likes: [],
            comments: []
        });
        await newPost.save();

        const adminUser = await UserModel.findOne({ role: 'admin' });
        if (adminUser) {
            const notificationData = {
                recipient: adminUser._id,
                title: "New Forum Post",
                message: `${user.name} has created a new forum post: ${title}`,
                type: 'system'
            };
            await NotificationModel.create(notificationData);

            // Gửi thông báo realtime
            io.to('admin-room').emit('newNotification', notificationData);
        }

        res.status(201).json({
            success: true,
            post: newPost
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Add comment in Post
export const addComment = CatchAsyncError(async (req, res, next) => {
    try {
        const { postId, content } = req.body;
        const userId = req.user._id;

        // Check if the post exists
        const post = await ForumModel.findById(postId);
        if (!post) {
            return next(new ErrorHandler("Forum post not found", 404));
        }

        // Get user details
        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Create the comment
        const newComment = {
            user: userId,
            content: content,
            likes: [],
            replies: []
        };

        // Add the comment to the post
        post.comments.push(newComment);
        await post.save();

        // Notify post owner
        if (post.user) {
            const notificationData = {
                recipient: post.user,
                title: "New Comment on Your Post",
                message: `${user.name} commented on your post: "${post.title}"`,
                type: 'forum'
            };
            await NotificationModel.create(notificationData);

            // Gửi thông báo realtime
            io.to(post.user.toString()).emit('newNotification', notificationData);
        }

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: newComment
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Add reply in Comment
export const addReply = CatchAsyncError(async (req, res, next) => {
    try {
        const { postId, commentId, content } = req.body;
        const userId = req.user._id;

        // Check if the post exists
        const post = await ForumModel.findById(postId);
        if (!post) {
            return next(new ErrorHandler("Forum post not found", 404));
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return next(new ErrorHandler("Comment not found", 404));
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const newReply = {
            user: userId,
            content: content,
            likes: []
        };
        comment.replies.push(newReply);
        await post.save();

        // Notify comment owner
        if (comment.user) {
            const notificationData = {
                recipient: comment.user,
                title: "New Reply to Your Comment",
                message: `${user.name} replied to your comment on the post: "${post.title}"`,
                type: 'forum'
            };
            await NotificationModel.create(notificationData);

            // Gửi thông báo realtime
            io.to(comment.user.toString()).emit('newNotification', notificationData);
        }

        res.status(201).json({
            success: true,
            message: "Reply added successfully",
            reply: newReply
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Like/unlike Post
export const likePost = CatchAsyncError(async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await ForumModel.findById(postId);
        if (!post) {
            return next(new ErrorHandler("Forum post not found", 404));
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const likedIndex = post.likes.findIndex(like => like.toString() === userId.toString());
        let message;

        if (likedIndex === -1) {
            post.likes.push(userId);
            message = "Post liked successfully";

            // Notify post owner if the post owner exists and is not the same as the liker
            if (post.user && post.user.toString() !== userId.toString()) {
                const notificationData = {
                    recipient: post.user,
                    title: "New Like on Your Post",
                    message: `${user.name} liked your post: "${post.title}"`,
                    type: 'forum'
                };
                await NotificationModel.create(notificationData);

                // Gửi thông báo realtime
                io.to(post.user.toString()).emit('newNotification', notificationData);
            }
        } else {
            post.likes.splice(likedIndex, 1);
            message = "Post unliked successfully";
        }

        await post.save();

        res.status(200).json({
            success: true,
            message: message,
            likesCount: post.likes.length
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Like or unlike a comment
export const likeComment = CatchAsyncError(async (req, res, next) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user._id;

        const post = await ForumModel.findById(postId);
        if (!post) {
            return next(new ErrorHandler("Forum post not found", 404));
        }
        const comment = post.comments.id(commentId);
        if (!comment) {
            return next(new ErrorHandler("Comment not found", 404));
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const likedIndex = comment.likes.findIndex(like => like.toString() === userId.toString());
        let message;

        if (likedIndex === -1) {
            comment.likes.push(userId);
            message = "Comment liked successfully";

            // Notify comment owner if they exist and are not the same as the liker
            if (comment.user && comment.user.toString() !== userId.toString()) {
                const notificationData = {
                    recipient: comment.user,
                    title: "New Like on Your Comment",
                    message: `${user.name} liked your comment on the post: "${post.title}"`,
                    type: 'forum'
                };
                await NotificationModel.create(notificationData);

                // Gửi thông báo realtime
                io.to(comment.user.toString()).emit('newNotification', notificationData);
            }
        } else {
            comment.likes.splice(likedIndex, 1);
            message = "Comment unliked successfully";
        }

        await post.save();

        res.status(200).json({
            success: true,
            message: message,
            likesCount: comment.likes.length
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Like or unlike a reply
export const likeReply = CatchAsyncError(async (req, res, next) => {
    try {
        const { postId, commentId, replyId } = req.params;
        const userId = req.user._id;

        const post = await ForumModel.findById(postId);
        if (!post) {
            return next(new ErrorHandler("Forum post not found", 404));
        }
        const comment = post.comments.id(commentId);
        if (!comment) {
            return next(new ErrorHandler("Comment not found", 404));
        }
        const reply = comment.replies.id(replyId);
        if (!reply) {
            return next(new ErrorHandler("Reply not found", 404));
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const likedIndex = reply.likes.findIndex(like => like.toString() === userId.toString());
        let message;

        if (likedIndex === -1) {
            reply.likes.push(userId);
            message = "Reply liked successfully";

            // Notify reply owner if they exist and are not the same as the liker
            if (reply.user && reply.user.toString() !== userId.toString()) {
                const notificationData = {
                    recipient: reply.user,
                    title: "New Like on Your Reply",
                    message: `${user.name} liked your reply on the post: "${post.title}"`,
                    type: 'forum'
                };
                await NotificationModel.create(notificationData);

                // Gửi thông báo realtime
                io.to(reply.user.toString()).emit('newNotification', notificationData);
            }
        } else {
            reply.likes.splice(likedIndex, 1);
            message = "Reply unliked successfully";
        }

        await post.save();

        res.status(200).json({
            success: true,
            message: message,
            likesCount: reply.likes.length
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// Edit a post
export const editPost = CatchAsyncError(async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { title, content, tags } = req.body;
        const userId = req.user._id;

        // Find the post
        const post = await ForumModel.findById(postId);
        if (!post) {
            return next(new ErrorHandler("Forum post not found", 404));
        }

        // Check if the user is the owner of the post
        if (post.user.toString() !== userId.toString()) {
            return next(new ErrorHandler("You are not authorized to edit this post", 403));
        }

        // Update the post
        post.title = title || post.title;
        post.content = content || post.content;
        post.tags = tags || post.tags;
        post.updatedAt = Date.now();

        await post.save();

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post: post
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Delete a post
export const deletePost = CatchAsyncError(async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        // Find the post
        const post = await ForumModel.findById(postId);
        if (!post) {
            return next(new ErrorHandler("Forum post not found", 404));
        }

        // Check if the user is the owner of the post or an admin
        const user = await UserModel.findById(userId);
        if (post.user.toString() !== userId.toString() && user.role !== 'admin') {
            return next(new ErrorHandler("You are not authorized to delete this post", 403));
        }

        // Delete the post
        await ForumModel.findByIdAndDelete(postId);

        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get All Posts
export const getAllPosts = CatchAsyncError(async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || '-createdAt';

        const skip = (page - 1) * limit;

        // Build the query
        let query = ForumModel.find();

        // Apply sorting
        query = query.sort(sort);

        // Apply pagination
        query = query.skip(skip).limit(limit);

        // Execute query to get posts
        const posts = await query.lean().exec();

        // Manually populate user data
        for (let post of posts) {
            if (post.user) {
                const userData = await UserModel.findById(post.user).select('name avatar').lean();
                post.user = userData;
            }

            // Populate user data for comments
            for (let comment of post.comments) {
                if (comment.user) {
                    const commentUserData = await UserModel.findById(comment.user).select('name avatar').lean();
                    comment.user = commentUserData;
                }

                // Populate user data for replies
                for (let reply of comment.replies) {
                    if (reply.user) {
                        const replyUserData = await UserModel.findById(reply.user).select('name avatar').lean();
                        reply.user = replyUserData;
                    }
                }
            }
        }

        // Get total count for pagination
        const totalPosts = await ForumModel.countDocuments();

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts: totalPosts,
            posts: posts
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});