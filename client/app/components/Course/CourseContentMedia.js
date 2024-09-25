import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowLeft, ArrowRight, BadgeCheck, ReplyIcon, Star } from "lucide-react";
import CourseVideoPlay from "@/app/utils/CourseVideoPlay";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import toast from "react-hot-toast";
import {
    useAddAnswerQuestionMutation,
    useAddReplyReviewInCourseMutation,
    useAddReviewInCourseMutation,
    useCreateNewQuestionMutation,
    useGetCourseDetailQuery,
} from "@/app/redux/features/courses/coursesApi";
import CommentReply from "./CommentReply";
import ReviewsTab from "./ReviewsTab";
import socketIO from 'socket.io-client';
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || '';
const socketId = socketIO(ENDPOINT, { transports: ['websocket'] });


const CourseContentMedia = ({
    id,
    user,
    data,
    activeVideo,
    setActiveVideo,
    refetch,
}) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [question, setQuestion] = useState("");
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(1);
    const [answer, setAnswer] = useState("");
    const [questionId, setQuestionId] = useState("");
    const [isReviewReply, setIsReviewReply] = useState(false);
    const [replyReview, setReplyReview] = useState("");
    const [reviewId, setReviewId] = useState("");
    const [
        createNewQuestion,
        { isSuccess, error, isLoading: createQuestionLoading },
    ] = useCreateNewQuestionMutation();
    const [
        addAnswerQuestion,
        {
            isSuccess: answerSuccess,
            error: answerError,
            isLoading: answerCreateLoading,
        },
    ] = useAddAnswerQuestionMutation();
    const [
        addReviewInCourse,
        {
            isSuccess: reviewSuccess,
            error: reviewError,
            isLoading: reviewCreateLoading,
        },
    ] = useAddReviewInCourseMutation();
    const [addReplyReviewInCourse, { isSuccess: replyReviewSuccess, error: replyReviewError, isLoading: replyReviewCreateLoading }] = useAddReplyReviewInCourseMutation()
    const { data: courseData, refetch: courseRefetch } = useGetCourseDetailQuery(id, { refetchOnMountOrArgChange: true });
    const course = courseData?.course;
    const isReviewExits = course?.reviews?.find(
        (item) => item.user._id === user._id
    );

    const handleQuestionSubmit = () => {
        if (question.length === 0) {
            toast.error("Please enter a question");
        } else {
            createNewQuestion({
                courseId: id,
                question,
                contentId: data[activeVideo]?._id,
            });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setQuestion("");
            refetch();
            socketId.emit('notification', {
                title: 'New Question Received',
                message: `You have a new question in ${data[activeVideo].title}`,
                userId: user._id
            });
            toast.success("Question added successfully");
        }
        if (error && "data" in error) {
            toast.error(error.data.message);
        }
    }, [isSuccess, error]);
    
    useEffect(() => {
        if (answerSuccess) {
            setAnswer("");
            refetch();
            toast.success("Answer added successfully");
            if (user.role === 'admin') {
                socketId.emit('notification', {
                    title: 'New Question Reply Received',
                    message: `You have a new question reply in ${data[activeVideo].title}`,
                    userId: user._id
                });
            }
        }
        if (answerError && "data" in answerError) {
            toast.error(answerError.data.message);
        }
    }, [answerSuccess, answerError]);
    
    useEffect(() => {
        if (reviewSuccess) {
            setReview("");
            setRating(1);
            courseRefetch();
            toast.success("Review added successfully");
            socketId.emit('notification', {
                title: 'New Review Received in Course',
                message: `${user.name} has given a review in ${data[activeVideo].title}`,
                userId: user._id
            });
        }
        if (reviewError && "data" in reviewError) {
            toast.error(reviewError.data.message);
        }
    }, [reviewSuccess, reviewError]);

    useEffect(() => {
        if (replyReviewSuccess) {
            setReplyReview("");
            courseRefetch();
            toast.success("Reply in review added successfully");
        }
        if (replyReviewError && "data" in replyReviewError) {
            toast.error(replyReviewError.data.message);
        }
    }, [replyReviewSuccess, replyReviewError]);
    

    const handleAnswerSubmit = () => {
        addAnswerQuestion({
            answer,
            courseId: id,
            contentId: data[activeVideo]._id,
            questionId: questionId,
        });
    };

    const handleReviewSubmit = () => {
        if (review.length === 0) {
            toast.error("Please enter a review");
        } else {
            addReviewInCourse({ review, rating, courseId: id });
        }
    };

    const handleReviewReplySubmit = () => {
        if (replyReview.length === 0) {
            toast.error("Please enter a reply review");
        } else {
            addReplyReviewInCourse({ comment: replyReview, courseId: id, reviewId })
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
                <div className="aspect-video w-full mb-4">
                    <CourseVideoPlay
                        title={data[activeVideo]?.title}
                        videoUrl={data[activeVideo]?.videoUrl}
                    />
                </div>
                <div className="flex items-center justify-between mb-4 mt-[-25px]">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                            setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
                        }
                        disabled={activeVideo === 0}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Previous Lesson</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                            setActiveVideo(
                                data && data.length - 1 === activeVideo
                                    ? activeVideo
                                    : activeVideo + 1
                            )
                        }
                        disabled={data && data.length - 1 === activeVideo}
                    >
                        <ArrowRight className="h-4 w-4" />
                        <span className="sr-only">Next Lesson</span>
                    </Button>
                </div>
                <CardTitle className="text-xl font-bold mb-4">
                    {data[activeVideo]?.title}
                </CardTitle>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="overflow-x-auto">
                        <TabsList className="inline-flex w-auto min-w-full">
                            {["Overview", "Resources", "Documents", "Q&A", "Reviews"].map(
                                (text) => (
                                    <TabsTrigger
                                        key={text.toLowerCase()}
                                        value={text.toLowerCase()}
                                    >
                                        {text}
                                    </TabsTrigger>
                                )
                            )}
                        </TabsList>
                    </div>
                    <TabsContent value="overview" className="mt-4">
                        <p className="text-sm lg:text-base whitespace-pre-line">
                            {data[activeVideo]?.description}
                        </p>
                    </TabsContent>
                    <TabsContent value="resources" className="mt-4">
                        {data[activeVideo]?.links.map((item, index) => (
                            <div className="mb-3" key={index}>
                                <h2 className="text-sm lg:text-base font-semibold inline-block">
                                    {item.title && `${item.title}:`}
                                </h2>
                                <a
                                    className="inline-block text-blue-500 text-sm lg:text-base ml-2"
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.url}
                                </a>
                            </div>
                        ))}
                    </TabsContent>
                    <TabsContent value="documents">
                        {/* Add content for Documents tab */}
                    </TabsContent>
                    <TabsContent value="q&a">
                        <div className="flex items-center gap-4">
                            <Image
                                src={
                                    user?.avatar
                                        ? user.avatar.url
                                        : "../../../public/assets/avatar.png"
                                }
                                alt=""
                                width={40}
                                height={40}
                                className="w-[40px] h-[40px] rounded-full border-2 border-primary"
                            />
                            <Textarea
                                placeholder="Write your question..."
                                rows={2}
                                className="mt-4 text-sm leading-relaxed text-muted-foreground"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                        </div>
                        <div className="w-full flex justify-end mt-2 mb-2">
                            <Button
                                size="sm"
                                className={`${createQuestionLoading && "cursor-not-allowed"}`}
                                onClick={
                                    createQuestionLoading ? () => { } : handleQuestionSubmit
                                }
                            >
                                Submit
                            </Button>
                        </div>
                        <CommentReply
                            data={data}
                            activeVideo={activeVideo}
                            answer={answer}
                            setAnswer={setAnswer}
                            handleAnswerSubmit={handleAnswerSubmit}
                            user={user}
                            questionId={questionId}
                            setQuestionId={setQuestionId}
                            answerCreateLoading={answerCreateLoading}
                        />
                    </TabsContent>
                    <TabsContent value="reviews">
                        <ReviewsTab
                            user={user}
                            course={course}
                            isReviewExits={isReviewExits}
                            rating={rating}
                            setRating={setRating}
                            review={review}
                            setReview={setReview}
                            isReviewReply={isReviewReply}
                            setIsReviewReply={setIsReviewReply}
                            setReviewId={setReviewId}
                            handleReviewSubmit={handleReviewSubmit}
                            reviewCreateLoading={reviewCreateLoading}
                            replyReview={replyReview}
                            setReplyReview={setReplyReview}
                            handleReviewReplySubmit={handleReviewReplySubmit}
                            replyReviewCreateLoading={replyReviewCreateLoading}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </div>
    );
};

export default CourseContentMedia;
