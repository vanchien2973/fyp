import CatchAsyncError from "../middlewares/CatchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import axios from 'axios';
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from 'ejs';
import SendMail from "../utils/SendMail";
import path from "path";
import CourseModel from "../models/course.model";
import { createCourse, getAllCoursService } from "../services/course.service";
import NotificationModel from "../models/notification.model";
require('dotenv').config();

// Create Course
export const uploadCourse = CatchAsyncError(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        }
        createCourse(data, res, next)
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// // Edit Course
// export const editCourse = CatchAsyncError(async (req, res, next) => {
//     try {
//         const data = req.body;
//         const thumbnail = data.thumbnail;

//         const courseId = req.params.id;
//         const courseData = await CourseModel.findById(courseId);

//         if (thumbnail && !thumbnail.startsWith("https")) {
//             await cloudinary.v2.uploader.destroy(courseData?.thumbnail?.public_id);

//             const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
//                 folder: "courses",
//             });

//             data.thumbnail = {
//                 public_id: myCloud.public_id,
//                 url: myCloud.secure_url,
//             };
//         } else if (thumbnail?.startsWith("https")) {
//             data.thumbnail = {
//                 public_id: courseData?.thumbnail?.public_id,
//                 url: courseData?.thumbnail?.url,
//             };
//         }

//         const course = await CourseModel.findByIdAndUpdate(courseId,
//             {
//                 $set: data,
//             },
//             { new: true }
//         );

//         res.status(200).json({
//             success: true,
//             course
//         });
//     } catch (error) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });

export const editCourse = CatchAsyncError(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;

        const courseId = req.params.id;
        const courseData = await CourseModel.findById(courseId);

        if (!courseData) {
            return next(new ErrorHandler("Course not found", 404));
        }

        // Handle thumbnail update
        if (thumbnail) {
            // New thumbnail uploaded
            if (!thumbnail.startsWith("https")) {
                // Delete old thumbnail if it exists
                if (courseData.thumbnail && courseData.thumbnail.public_id) {
                    await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);
                }

                // Upload new thumbnail
                const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                    folder: "courses",
                });

                data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            } else {
                // Thumbnail is a URL, keep existing data
                data.thumbnail = courseData.thumbnail;
            }
        } else {
            // No new thumbnail provided, keep existing data
            data.thumbnail = courseData.thumbnail;
        }

        // Update course
        const course = await CourseModel.findByIdAndUpdate(
            courseId,
            { $set: data },
            { new: true }
        );

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get Single Course (without purchase)
export const getSingleCourse = CatchAsyncError(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const isCacheExist = await redis.get(courseId);

        if (isCacheExist) {
            const course = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                course
            });
        } else {
            const course = await CourseModel.findById(courseId).select("-courseData.videlUrl -courseData.suggestion -courseData.questions -courseData.links");
            await redis.set(courseId, JSON.stringify(course), 'EX', 604800); // 7 days

            res.status(200).json({
                success: true,
                course
            });
        };
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get All Courses (without purchase)
export const getAllCourses = CatchAsyncError(async (req, res, next) => {
    try {
            const courses = await CourseModel.find().select("-courseData.videlUrl -courseData.suggestion -courseData.questions -courseData.links");
            // await redis.set("allCourses", JSON.stringify(courses));
            res.status(200).json({
                success: true,
                courses
            });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get Course Content (for user puchased)
export const getCourseByUser = CatchAsyncError(async (req, res, next) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExists = userCourseList?.find((course) => course._id.toString() === courseId);

        if (!courseExists) {
            return next(new ErrorHandler("You are not authorized to access this course", 404));
        };

        const course = await CourseModel.findById(courseId);

        const content = course?.courseData;

        res.status(200).json({
            success: true,
            content
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Add Question in Course
export const addQuestion = CatchAsyncError(async (req, res, next) => {
    try {
        const { question, courseId, contentId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid Content Id", 400));
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const courseContent = course?.courseData?.find((item) => item._id.equals(contentId));

        if (!courseContent) {
            return next(new ErrorHandler("Invalid Content Id", 400));
        }

        const newQuestion = {
            user: req.user,
            question,
            questionReplies: [],
        };
        courseContent.questions.push(newQuestion);

        // Add notification
        NotificationModel.create({
            user: req.user?._id,
            title: "New Question Received",
            message: `You have a new question in ${courseContent.title}`
        });

        await course.save();
        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Add Answer in Course Question
export const addAnswer = CatchAsyncError(async (req, res, next) => {
    try {
        const { answer, courseId, contentId, questionId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid Content Id", 400));
        };

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        };

        const courseContent = course.courseData.find((item) => item._id.equals(contentId));

        if (!courseContent) {
            return next(new ErrorHandler("Invalid Content Id", 400));
        };

        const question = courseContent.questions.find((item) => item._id.equals(questionId));

        if (!question) {
            return next(new ErrorHandler("Invalid Question Id", 400));
        };

        const newAnswer = {
            user: req.user,
            answer,
        };

        question.questionReplies.push(newAnswer);
        await course?.save();

        if (req.user._id === question.user._id) {
            NotificationModel.create({
                user: req.user?._id,
                title: "New Question Reply Received",
                message: `You have a new question reply in ${courseContent.title}`
            });
        } else {
            const data = {
                name: question.user.name,
                title: courseContent.title,
            };
            const html = await ejs.renderFile(path.join(__dirname, "../mails/QuestionReply.ejs"), data);
            try {
                await SendMail({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "QuestionReply.ejs",
                    data
                });
            } catch (error) {
                return next(new ErrorHandler(error.message, 500));
            }
        }

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Add Review in Course
export const addReview = CatchAsyncError(async (req, res, next) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExists = userCourseList.some((course) => course._id.toString() === courseId.toString());

        if (!courseExists) {
            return next(new ErrorHandler("You are not authorized to access this course", 404));
        }

        const course = await CourseModel.findById(courseId);
        const { review, rating } = req.body;
        const reviewData = {
            user: req.user,
            comment: review,
            rating
        }
        course.reviews.push(reviewData);
        await course.save();

        let average = 0;
        course?.reviews.forEach((review) => {
            average += review.rating;
        });
        if (course) {
            average = average / course.reviews.length;
            course.ratings = average;
        }
        await course.save();
        const notification = {
            title: 'New Review Received in Course',
            message: `${req.user?.name} has given a review in ${course?.name}!`
        }
        await NotificationModel.create(notification);

        res.status(200).json({
            success: true,
            course
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Add Reply in Review (for Admin)
export const addReplyForReview = CatchAsyncError(async (req, res, next) => {
    try {
        const { comment, courseId, reviewId } = req.body;
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }
        const review = course.reviews.find((review) => review._id.toString() === reviewId);
        if (!review) {
            return next(new ErrorHandler("Review not found", 404));
        }
        const replyData = {
            user: req.user,
            comment
        }
        if (!review.commentReplies) {
            review.commentReplies = [];
        }
        review.commentReplies?.push(replyData);
        await course?.save();
        res.status(200).json({
            success: true,
            course
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Generate Video Url
export const generateVideoUrl = CatchAsyncError(async (req, res, next) => {
    try {
        const { videoId } = req.body;
        const response = await axios.post(
            `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
            { ttl: 300 },
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
                },
            }
        );
        res.json(response.data)
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Get All Courses (for Admin)
export const getAllCoursesInSystem = CatchAsyncError(async (req, res, next) => {
    try {
        getAllCoursService(res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Delete Course (for Admin)
export const deleteCourse = CatchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await CourseModel.findById(id);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }
        await course.deleteOne({ id });
        await redis.del(id);
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
