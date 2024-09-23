import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { UserAvatar } from "../ui/avatar";
import { BadgeCheck, ReplyIcon, Star, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "timeago.js";

const ReviewsTab = ({
    user,
    course,
    isReviewExits,
    rating,
    setRating,
    review,
    setReview,
    handleReviewSubmit,
    reviewCreateLoading,
    replyReview,
    setReplyReview,
    setReviewId,
    handleReviewReplySubmit,
    replyReviewCreateLoading,
    setIsReviewReply,
    isReviewReply
}) => {
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [showReplies, setShowReplies] = useState({});

    const toggleReplyReview = (reviewId) => {
        if (activeReplyId === reviewId) {
            setActiveReplyId(null);
            setIsReviewReply(false);
            setReplyReview('');
        } else {
            setActiveReplyId(reviewId);
            setIsReviewReply(true);
            setReviewId(reviewId);
        }
    };

    const toggleShowReplies = (reviewId) => {
        setShowReplies(prev => ({
            ...prev,
            [reviewId]: !prev[reviewId]
        }));
    };

    return (
        <div className="space-y-6">
            {!isReviewExits && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Write a Review</h3>
                    <div className="flex items-center gap-2 mb-2">
                        <span>Rating:</span>
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setRating(i)}
                                    aria-label={`Rate ${i} star${i !== 1 ? "s" : ""}`}
                                >
                                    <Star
                                        className={`h-5 w-5 ${rating >= i ? "text-yellow-400" : "text-gray-300"}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <Textarea
                        placeholder="Write your review..."
                        className="w-full mb-2"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                    />
                    <Button
                        onClick={handleReviewSubmit}
                        disabled={reviewCreateLoading}
                    >
                        {reviewCreateLoading ? "Submitting..." : "Submit Review"}
                    </Button>
                </div>
            )}

            <div className="space-y-4">
                {course?.reviews &&
                    [...course.reviews].reverse().map((item) => (
                        <div key={item._id} className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-start gap-4">
                                <UserAvatar
                                    user={item.user}
                                    className="h-10 w-10 rounded-full"
                                />
                                <div className="flex-grow">
                                    <div className="flex items-center gap-1">
                                        <h4 className="font-semibold">{item.user.name}</h4>
                                    </div>
                                    <div className="flex items-center gap-1 my-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i <= item.rating ? "text-yellow-400" : "text-gray-300"}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600">{item.review}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {format(item.createdAt)}
                                    </p>
                                    {user.role === 'admin' && (
                                        <div className="mt-2">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleReplyReview(item._id)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <ReplyIcon className="w-4 h-4" />
                                                    {activeReplyId === item._id ? 'Hide Reply' : 'Reply'}
                                                </Button>
                                                {item.commentReplies && item.commentReplies.length > 0 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleShowReplies(item._id)}
                                                        className="flex items-center gap-1"
                                                    >
                                                        {showReplies[item._id] ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        )}
                                                        {showReplies[item._id] ? 'Hide' : 'Show'} Replies ({item.commentReplies.length})
                                                    </Button>
                                                )}
                                            </div>
                                            {isReviewReply && activeReplyId === item._id && (
                                                <div className="mt-2 space-y-2">
                                                    <Input
                                                        placeholder="Write your reply..."
                                                        value={replyReview}
                                                        onChange={(e) => setReplyReview(e.target.value)}
                                                    />
                                                    <Button
                                                        size='sm'
                                                        disabled={replyReviewCreateLoading}
                                                        onClick={() => {
                                                            handleReviewReplySubmit();
                                                            toggleReplyReview(item._id);
                                                        }}
                                                    >
                                                        {replyReviewCreateLoading ? "Submitting..." : "Submit"}
                                                    </Button>
                                                </div>
                                            )}
                                            {showReplies[item._id] && item.commentReplies && item.commentReplies.length > 0 && (
                                                <div className="mt-2 space-y-2">
                                                    {item.commentReplies.map((comment, index) => (
                                                        <div key={index} className="flex items-start gap-4 border-l-2 border-gray-200 pl-4">
                                                            <div className="flex items-start gap-2">
                                                                <UserAvatar
                                                                    user={comment.user}
                                                                    className="h-8 w-8 rounded-full"
                                                                />
                                                                <div>
                                                                    <div className="flex items-center gap-1">
                                                                        <h6 className="text-sm font-semibold">{comment.user.name}</h6>
                                                                        <BadgeCheck className="w-4 h-4 text-blue-500" />
                                                                    </div>
                                                                    <p className="text-sm text-gray-600">{comment.comment}</p>
                                                                    <p className="text-xs text-gray-400 mt-1">
                                                                        {format(comment.createdAt)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ReviewsTab;