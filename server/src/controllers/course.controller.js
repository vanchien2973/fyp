import CatchAsyncError from "../middlewares/CatchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import axios from 'axios';
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import CourseModel from "../models/course.model";
import { createCourse, getAllCoursService } from "../services/course.service";
import NotificationModel from "../models/notification.model";
import UserModel from "../models/user.model";
import { io } from "../../socketServer";
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
        createCourse(data, res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// Edit Course
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
        const course = await CourseModel.findById(courseId).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        await redis.set(courseId, JSON.stringify(course), 'EX', 604800); // 7 days

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get All Courses (without purchase)
export const getAllCourses = CatchAsyncError(async (req, res, next) => {
    try {
        const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        await redis.set("allCourses", JSON.stringify(courses));
        res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get Course Content (for user purchased)
export const getCourseByUser = CatchAsyncError(async (req, res, next) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;

        // Cho phép admin truy cập mà không cần kiểm tra đã mua
        if (req.user.role === 'admin') {
            const course = await CourseModel.findById(courseId);
            if (!course) {
                return next(new ErrorHandler("Course not found", 404));
            }
            const contents = course?.courseData;
            return res.status(200).json({
                success: true,
                contents
            });
        }

        // Kiểm tra với người dùng thông thường
        const courseExists = userCourseList?.find((course) => course._id.toString() === courseId);
        if (!courseExists) {
            return next(new ErrorHandler("You are not authorized to access this course", 404));
        };

        const course = await CourseModel.findById(courseId);
        const contents = course?.courseData;

        res.status(200).json({
            success: true,
            contents
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
        const courseContent = course.courseData[0].content.find(
            (item) => item._id.toString() === contentId
        );
        if (!courseContent) {
            return next(new ErrorHandler("Invalid Content Id", 400));
        }
        const newQuestion = {
            user: req.user,
            question,
            questionReplies: [],
        };
        courseContent.questions.push(newQuestion);

        const adminUser = await UserModel.findOne({ role: 'admin' });
        if (adminUser) {
            const notificationData = {
                recipient: adminUser._id,
                title: "New Question Received",
                message: `You have a new question in ${courseContent.title}`,
                type: 'system'
            };
            await NotificationModel.create(notificationData);

            // Gửi thông báo realtime
            io.to('admin-room').emit('newNotification', notificationData);
        }
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
        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        };

        const courseContent = course.courseData[0].content.find(
            (item) => item._id.toString() === contentId
        );

        if (!courseContent) {
            return next(new ErrorHandler("Invalid Content Id", 400));
        };

        const question = courseContent.questions.find(
            (item) => item._id.equals(questionId.id)
        );

        if (!question) {
            return next(new ErrorHandler("Invalid Question Id", 400));
        };

        const newAnswer = {
            user: req.user,
            answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        question.questionReplies.push(newAnswer);
        await course?.save();

        if (questionId.user && questionId.user._id) {
            const notificationData = {
                recipient: questionId.user._id,
                title: "New Answer to Your Question",
                message: `Your question in ${courseContent.title} has a new answer`,
                type: 'course'
            };
            await NotificationModel.create(notificationData);

            // Gửi thông báo realtime
            io.to(questionId.user._id.toString()).emit('newNotification', notificationData);
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
        const userCourseList = req.user?.courses || [];
        const courseId = req.params.id;

        const courseExists = userCourseList.some((course) => {
            return course && course._id && course._id.toString() === courseId.toString();
        });

        if (!courseExists) {
            return next(new ErrorHandler("You are not authorized to access this course", 404));
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const { review, rating } = req.body;

        if (!review || !rating) {
            return next(new ErrorHandler("Please provide both review and rating", 400));
        }

        const reviewData = {
            user: req.user,
            comment: review,
            rating: Number(rating)
        }

        course.reviews.push(reviewData);

        // Recalculate average rating
        const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
        course.ratings = totalRating / course.reviews.length;

        await course.save();
        await redis.set(courseId, JSON.stringify(course), 'EX', 604800); // 7 days

        // Add notification for course creator
        const adminUser = await UserModel.findOne({ role: 'admin' });
        if (adminUser) {
            const notificationData = {
                recipient: adminUser._id,
                title: "New Course Review",
                message: `${req.user.name} has left a review for ${course.name}`,
                type: 'system'
            };
            await NotificationModel.create(notificationData);

            // Gửi thông báo realtime
            io.to('admin-room').emit('newNotification', notificationData);
        }

        res.status(200).json({
            success: true,
            course
        });
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
            comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        if (!review.commentReplies) {
            review.commentReplies = [];
        }
        review.commentReplies?.push(replyData);

        // Add notification for review author
        if (reviewId.user && reviewId.user._id) {
            const notificationData = {
                recipient: reviewId.user._id,
                title: "New Reply to Your Review",
                message: `Admin has replied to your review on ${course.name}`,
                type: 'course'
            };
            await NotificationModel.create(notificationData);

            // Gửi thông báo realtime
            io.to(reviewId.user._id.toString()).emit('newNotification', notificationData);
        }

        await course?.save();
        await redis.set(courseId, JSON.stringify(course), 'EX', 604800); // 7 days
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
        const apiUrl = `https://dev.vdocipher.com/api/videos/${videoId}/otp`;

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
        };

        const response = await axios.post(
            apiUrl,
            { ttl: 300 },
            { headers }
        );
        res.json(response.data);
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

        if (course.purchased > 0) {
            return next(new ErrorHandler("Cannot delete course with active enrollments", 400));
        }

        if (course.thumbnail && course.thumbnail.public_id) {
            await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);
        }

        await course.deleteOne({ id });
        await redis.del(id);

        res.status(200).json({
            success: true,
            message: "Course and all associated content deleted successfully",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
