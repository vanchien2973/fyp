import CatchAsyncError from "../middlewares/CatchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import ejs from 'ejs';
import SendMail from "../utils/SendMail";
import path from "path";
import CourseModel from "../models/course.model";
import UserModel from "../models/user.model";
import { createOrderService, getAllOrdersService } from "../services/order.service";
import NotificationModel from "../models/notification.model";
require('dotenv').config();

// Create Order
export const createOrder = CatchAsyncError(async (req, res, next) => {
    try {
        const { courseId, paymentInfor } = req.body;

        if (!courseId) {
            return next(new ErrorHandler("Course ID is required", 400));
        }

        const user = await UserModel.findById(req.user?._id);
        const courseExistInUser = user?.courses.some(course => course._id.toString() === courseId);

        if (courseExistInUser) {
            return next(new ErrorHandler("Course already exists in your course list!", 400));
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const data = {
            courseId: course._id,
            userId: user?._id,
            price: course.price,
            paymentInfor,
        };

        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }),
            }
        };

        // Render the email template
        const html = await ejs.renderFile(path.join(__dirname, '../mails/OrderConfirmation.ejs'), mailData);

        try {
            if (user) {
                await SendMail({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "OrderConfirmation.ejs",
                    data: mailData
                });
            }
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }

        user.courses.push(course?._id);
        await user?.save();

        await NotificationModel.create({
            user: user._id,
            title: 'New Order',
            message: `You have a new order from ${course.name}`,
        });

        // Update the purchased count
        course.purchased = (course.purchased || 0) + 1;
        await course.save();
        createOrderService(data, res, next);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get All Orders (for Admin)
export const getAllOrdersInSystem = CatchAsyncError(async (req, res, next) => {
    try {
        getAllOrdersService(res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
