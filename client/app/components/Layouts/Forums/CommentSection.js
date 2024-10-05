import React, { useEffect, useState } from 'react';
import { UserAvatar } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { ReplyIcon, ThumbsUpIcon, ChevronDownIcon, ChevronUpIcon, MessageCircleIcon, SendIcon } from 'lucide-react';
import { format } from 'timeago.js';
import { CardFooter } from '../../ui/card';
import { Input } from '../../ui/input';
import { useAddCommentMutation, useAddReplyMutation, useLikeCommentMutation, useLikePostMutation, useLikeReplyMutation } from '@/app/redux/features/forum/forumApi';
import toast from 'react-hot-toast';
import socketIO from 'socket.io-client';
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || '';
const socketId = socketIO(ENDPOINT, { transports: ['websocket'] });

const CommentSection = ({ postTitle, postId, comments, currentUser, refetch, likes }) => {
    const [visibleComments, setVisibleComments] = useState(3);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState({});
    const [replyContents, setReplyContents] = useState({});
    const [addComment, { isSuccess: addCommentSuccess, error: addCommentError }] = useAddCommentMutation();
    const [addReply, { isSuccess: addReplySuccess, error: addReplyError }] = useAddReplyMutation();
    const [visibleReplies, setVisibleReplies] = useState({});
    const [showReplies, setShowReplies] = useState({});
    const [likePost] = useLikePostMutation();
    const [likeComment] = useLikeCommentMutation();
    const [likeReply] = useLikeReplyMutation();

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const toggleMoreReplies = (commentId) => {
        setVisibleReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const toggleShowReplies = (commentId) => {
        setShowReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const toggleReplyTo = (commentId) => {
        setReplyingTo(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    useEffect(() => {
        if (addCommentSuccess) {
            refetch();
            setNewComment('');
            socketId.emit('notification', {
                userId: currentUser._id,
                title: 'New Comment on Your Post',
                message: `${currentUser.name} commented on your post: ${postTitle}`,
                type: 'forum'
            });
            toast.success('Comment added successfully');
        }
        if (addCommentError && "data" in addCommentError) {
            toast.error(addCommentError.data.message);
        }
    }, [addCommentSuccess, addCommentError, refetch]);

    useEffect(() => {
        if (addReplySuccess) {
            refetch();
            setReplyContents({});
            setReplyingTo({});
            socketId.emit('notification', {
                userId: currentUser._id,
                title: 'New Reply to Your Comment',
                message: `${currentUser.name} replied to your comment on the post: ${postTitle}`,
                type: 'forum'
            });
            toast.success('Reply added successfully');
        }
        if (addReplyError && "data" in addReplyError) {
            toast.error(addReplyError.data.message);
        }
    }, [addReplySuccess, addReplyError, refetch]);

    const toggleMoreComments = () => {
        setVisibleComments(prev => prev === 3 ? comments.length : 3);
    };

    const handleAddComment = async () => {
        if (newComment.trim() === '') return;
        const comment = {
            postId,
            content: newComment,
            user: currentUser,
        };
        await addComment(comment).unwrap();
    };

    const handleReply = async (commentId) => {
        const replyContent = replyContents[commentId];
        if (!replyContent || replyContent.trim() === '') return;
        const reply = {
            postId,
            commentId,
            content: replyContent,
            user: currentUser,
        };
        await addReply(reply).unwrap();
    };

    const handleReplyContentChange = (commentId, content) => {
        setReplyContents(prev => ({
            ...prev,
            [commentId]: content
        }));
    };

    const handleLikePost = async () => {
        await likePost({ postId }).unwrap();
        refetch();
        socketId.emit('notification', {
            userId: currentUser._id,
            title: 'New Like on Your Post',
            message: `${currentUser.name} liked your post: ${postTitle}`,
            type: 'forum'
        });
    };

    const handleLikeComment = async (commentId) => {
        await likeComment({ postId, commentId }).unwrap();
        refetch();
        socketId.emit('notification', {
            userId: currentUser._id,
            title: 'New Like on Your Comment',
            message: `${currentUser.name} liked your comment: ${postTitle}`,
            type: 'forum'
        });
    };

    const handleLikeReply = async (commentId, replyId) => {
        await likeReply({ postId, commentId, replyId }).unwrap();
        refetch();
        socketId.emit('notification', {
            userId: currentUser._id,
            title: 'New Like on Your Reply',
            message: `${currentUser.name} liked your reply: ${postTitle}`,
            type: 'forum'
        });
    };

    return (
        <div className="mt-4">
            <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleComments}>
                        <MessageCircleIcon className="h-4 w-4" />
                        <span className="sr-only">Comment</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleLikePost}>
                        <ThumbsUpIcon className="h-4 w-4" />
                        <span className="sr-only">Like</span>
                    </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                    <span>{comments.length} comments</span> &middot; <span>{likes.length} likes</span>
                </div>
            </CardFooter>

            {showComments && (
                <div className="mt-4">
                    <div className="mb-4 flex items-center gap-2">
                        <UserAvatar user={currentUser} />
                        <Input
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-grow"
                        />
                        <Button onClick={handleAddComment}>
                            <SendIcon className="w-4 h-4" />
                        </Button>
                    </div>

                    {comments.slice(0, visibleComments).map((comment) => (
                        <div key={comment._id} className="text-sm flex items-start gap-4 mt-4">
                            <UserAvatar user={comment.user} />
                            <div className="grid gap-1.5 flex-grow">
                                <div className="flex items-center gap-2">
                                    <div className="font-semibold">@{comment.user.name}</div>
                                    <div className="text-gray-500 text-xs dark:text-gray-400">{format(comment.createdAt)}</div>
                                </div>
                                <div>{comment.content}</div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleLikeComment(comment._id)}>
                                        <ThumbsUpIcon className="w-4 h-4 mr-1" />
                                        Like ({comment.likes.length})
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => toggleReplyTo(comment._id)}>
                                        <ReplyIcon className="w-4 h-4 mr-1" />
                                        Reply
                                    </Button>
                                    {comment.replies && comment.replies.length > 0 && (
                                        <Button variant="ghost" size="sm" onClick={() => toggleShowReplies(comment._id)}>
                                            {showReplies[comment._id] ?
                                                <>
                                                    <ChevronDownIcon className="w-4 h-4 mr-2" />
                                                    Hide Replies {comment.replies.length}
                                                </> :
                                                <>
                                                    <ChevronUpIcon className="w-4 h-4 mr-2" />
                                                    Show Replies {comment.replies.length}
                                                </>
                                            }
                                        </Button>
                                    )}
                                </div>
                                {replyingTo[comment._id] && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <Input
                                            placeholder="Write a reply..."
                                            value={replyContents[comment._id] || ''}
                                            onChange={(e) => handleReplyContentChange(comment._id, e.target.value)}
                                            className="flex-grow"
                                        />
                                        <Button onClick={() => handleReply(comment._id)}>
                                            <SendIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                                {showReplies[comment._id] && comment.replies && comment.replies.length > 0 && (
                                    <div className="ml-6 mt-2">
                                        {(comment.replies || [])
                                            .slice(0, visibleReplies[comment._id] ? comment.replies.length : 3)
                                            .map((reply) => (
                                                <div key={reply._id} className="flex items-start gap-4 mt-2">
                                                    <UserAvatar user={reply.user} />
                                                    <div className="grid gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-semibold">@{reply.user.name}</div>
                                                            <div className="text-gray-500 text-xs dark:text-gray-400">{format(reply.createdAt)}</div>
                                                        </div>
                                                        <div>{reply.content}</div>
                                                        <Button variant="ghost" size="sm" onClick={() => handleLikeReply(comment._id, reply._id)}>
                                                            <ThumbsUpIcon className="w-4 h-4 mr-1" />
                                                            Like ({reply.likes.length})
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        {comment.replies.length > 3 && (
                                            <Button
                                                variant="ghost"
                                                onClick={() => toggleMoreReplies(comment._id)}
                                                className="mt-2 flex items-center justify-center"
                                            >
                                                {!visibleReplies[comment._id] ? (
                                                    <>
                                                        <ChevronDownIcon className="w-4 h-4 mr-2" />
                                                        Show more ({comment.replies.length - 3} more)
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronUpIcon className="w-4 h-4 mr-2" />
                                                        Show less
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {comments.length > 3 && (
                        <Button
                            variant="ghost"
                            onClick={toggleMoreComments}
                            className="mt-4 flex items-center justify-center"
                        >
                            {visibleComments === 3 ? (
                                <>
                                    <ChevronDownIcon className="w-4 h-4 mr-2" />
                                    Show more ({comments.length - 3} more)
                                </>
                            ) : (
                                <>
                                    <ChevronUpIcon className="w-4 h-4 mr-2" />
                                    Show less
                                </>
                            )}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentSection;