import React, { useState } from "react";
import { ReplyIcon, ChevronDown, ChevronUp, BadgeCheck } from "lucide-react";
import { UserAvatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { format } from "timeago.js";

const CommentReply = ({
    data,
    activeVideo,
    answer,
    setAnswer,
    handleAnswerSubmit,
    setQuestionId,
    answerCreateLoading
}) => {
    return (
        <div className="space-y-4">
            {data[activeVideo].questions.map((item, index) => (
                <CommentItem
                    key={index}
                    item={item}
                    answer={answer}
                    setAnswer={setAnswer}
                    setQuestionId={setQuestionId}
                    handleAnswerSubmit={handleAnswerSubmit}
                    answerCreateLoading={answerCreateLoading}
                />
            ))}
        </div>
    );
};

const CommentItem = ({
    item,
    answer,
    setAnswer,
    setQuestionId,
    handleAnswerSubmit,
    answerCreateLoading,
}) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [showAnswers, setShowAnswers] = useState(true);

    const handleReplyClick = () => {
        setShowReplyInput(!showReplyInput);
        setQuestionId(item._id);
    };

    const onSubmitAnswer = () => {
        handleAnswerSubmit();
        setShowReplyInput(false);
    };

    const toggleAnswers = () => {
        setShowAnswers(!showAnswers);
    };

    return (
        <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-start gap-4">
                <UserAvatar user={item?.user} className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <span className="font-semibold">{item.user.name}</span>
                            {item.user.role === 'admin' && (
                                <BadgeCheck className="w-4 h-4 text-blue-500" />
                            )}
                        </div>
                        <div className="text-gray-500 text-xs">
                            {item.createdAt ? format(item?.createdAt) : ""}
                        </div>
                    </div>
                    <div className="mt-1">{item?.question}</div>
                    <div className="flex items-center gap-2 mt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReplyClick}
                        >
                            <ReplyIcon className="w-4 h-4 mr-1" />
                            Reply
                        </Button>
                        {item.questionReplies && item.questionReplies.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleAnswers}
                            >
                                {showAnswers ? (
                                    <ChevronUp className="w-4 h-4 mr-1" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 mr-1" />
                                )}
                                {showAnswers ? "Hide" : "Show"} ({item.questionReplies.length})
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            {/* Reply input */}
            {showReplyInput && (
                <div className="ml-14 space-y-2 mt-4">
                    <Input
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer..."
                        className={`${answer === '' || answerCreateLoading && 'cursor-not-allowed'}`}
                    />
                    <Button
                        size='sm'
                        onClick={onSubmitAnswer}
                        disabled={answer === '' || answerCreateLoading}
                    >
                        {answerCreateLoading ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            )}
            {/* Answers section */}
            {showAnswers && item.questionReplies && item.questionReplies.length > 0 && (
                <div className="ml-14 space-y-4 mt-4">
                    {item.questionReplies.map((answerItem, index) => (
                        <div key={index} className="flex items-start gap-4 border-l-2 border-gray-200 pl-4">
                            <UserAvatar user={answerItem.user} className="h-8 w-8 rounded-full" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold">{answerItem.user.name}</span>
                                        {answerItem.user.role === 'admin' && (
                                            <BadgeCheck className="w-4 h-4 text-blue-500" />
                                        )}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        {format(answerItem.createdAt)}
                                    </div>
                                </div>
                                <div className="mt-1">{answerItem.answer}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentReply;