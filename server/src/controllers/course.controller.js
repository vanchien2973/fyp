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