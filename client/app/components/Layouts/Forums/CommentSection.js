import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage, UserAvatar } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { ReplyIcon, ThumbsUpIcon, ChevronDownIcon, ChevronUpIcon, MessageCircleIcon, HeartIcon, SendIcon } from 'lucide-react';
import { format } from 'timeago.js';
import { CardFooter } from '../../ui/card';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { useAddCommentMutation } from '@/app/redux/features/forum/forumApi';
import toast from 'react-hot-toast';

const CommentSection = ({ postId, comments: initialComments, currentUser, refetch }) => {
    const [comments, setComments] = useState(initialComments);
    const [visibleComments, setVisibleComments] = useState(3);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [addComment, { isSuccess: addCommentSuccess, error: addCommentError, isLoading: addCommentLoading }] = useAddCommentMutation();

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    useEffect(() => {
        if (addCommentSuccess) {
            setNewComment('');
            refetch();
            // toast.success('');
        }
        if (addCommentError && "data" in addCommentError) {
            toast.error(addCommentError.data.message);
        }
    }, [addCommentSuccess, addCommentError]);

    const toggleMoreComments = () => {
        if (visibleComments === 3) {
            setVisibleComments(comments.length);
        } else {
            setVisibleComments(3);
        }
    };

    const handleAddComment =  async () => {
        if (newComment.trim() === '') return;
        const comment = {
            postId,
            content: newComment,
            user: currentUser,
        };
        await addComment(comment).unwrap();
        setComments([comment, ...comments]);
    };

    const handleReply = (commentId) => {
        if (replyContent.trim() === '') return;
        const updatedComments = comments.map((comment) => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: [
                        ...comment.replies,
                        {
                            id: Date.now(),
                            content: replyContent,
                            user: currentUser,
                            createdAt: format(new Date()),
                            likes: 0,
                        },
                    ],
                };
            }
            return comment;
        });
        setComments(updatedComments);
        setReplyingTo(null);
        setReplyContent('');
    };

    return (
        <>
            <div className="mt-4">
                <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={toggleComments}>
                            <MessageCircleIcon className="h-4 w-4" />
                            <span className="sr-only">Comment</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                            <HeartIcon className="h-4 w-4" />
                            <span className="sr-only">Like</span>
                        </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        <span>{comments.length} comments</span> &middot; <span>{'0'} likes</span>
                    </div>
                </CardFooter>

                {showComments && (
                    <div className="mt-4">
                        <div className="mb-4 flex items-center gap-2">
                            <Avatar className="w-10 h-10 border">
                                <AvatarImage src={currentUser.avatar || "/placeholder-user.jpg"} alt={currentUser.name} />
                                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
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
                            <div key={comment.id} className="text-sm flex items-start gap-4 mt-4">
                                <UserAvatar user={comment.user}/>
                                <div className="grid gap-1.5 flex-grow">
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold">@{comment.user.name}</div>
                                        <div className="text-gray-500 text-xs dark:text-gray-400">{comment.createdAt}</div>
                                    </div>
                                    <div>{comment.content}</div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm">
                                            <ThumbsUpIcon className="w-4 h-4 mr-1" />
                                            Like
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => setReplyingTo(comment.id)}>
                                            <ReplyIcon className="w-4 h-4 mr-1" />
                                            Reply
                                        </Button>
                                    </div>
                                    {replyingTo === comment.id && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <Input
                                                placeholder="Write a reply..."
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                className="flex-grow"
                                            />
                                            <Button onClick={() => handleReply(comment.id)}>
                                                <SendIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className="ml-6 mt-2">
                                            {comment.replies.map((reply) => (
                                                <div key={reply.id} className="flex items-start gap-4 mt-2">
                                                    <Avatar className="w-8 h-8 border">
                                                        <AvatarImage src={reply.user.avatar || "/placeholder-user.jpg"} alt={reply.user.name} />
                                                        <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="grid gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-semibold">@{reply.user.name}</div>
                                                            <div className="text-gray-500 text-xs dark:text-gray-400">{reply.createdAt}</div>
                                                        </div>
                                                        <div>{reply.content}</div>
                                                        <Button variant="ghost" size="sm">
                                                            <ThumbsUpIcon className="w-4 h-4 mr-1" />
                                                            Like
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
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
        </>
    );
};

export default CommentSection;