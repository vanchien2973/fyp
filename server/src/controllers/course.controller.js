import CatchAsyncError from "../middlewares/CatchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import redis from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs";
import SendMail from "../utils/SendMail";
import path from "path";
import CourseModel from "../models/course.model";
import { createCourse } from "../services/course.service";

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

// Edit Course
export const editCourse = CatchAsyncError(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;

        if (thumbnail) {
            await cloudinary.v2.uploader.destroy(thumbnail.public_id);

            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        }

        const courseId = req.params.id;

        const course = await CourseModel.findByIdAndUpdate(courseId,
            {
                $set: data,
            },
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
            await redis.set(courseId, JSON.stringify(course));

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
        const isCacheExist = await redis.get("allCourses");

        if (isCacheExist) {
            const courses = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                courses
            });
        } else {
            const courses = await CourseModel.find().select("-courseData.videlUrl -courseData.suggestion -courseData.questions -courseData.links");
            await redis.set("allCourses", JSON.stringify(courses));

            res.status(200).json({
                success: true,
                courses
            });
        }
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