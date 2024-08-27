import CatchAsyncError from "../middlewares/CatchAsyncError";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";
import UserModel from "../models/user.model";
import { generateLast12MonthsData } from "../utils/AnalyticsGenerator";
import ErrorHandler from "../utils/ErrorHandler";

// Get Users Analytics (for Admin)
export const getUsersAnalytics = CatchAsyncError(async (req, res, next) => {
    try {
        const users = await generateLast12MonthsData(UserModel);
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
});

// Get Courses Analytics (for Admin)
export const getCoursesAnalytics = CatchAsyncError(async (req, res, next) => {
    try {
        const courses = await generateLast12MonthsData(CourseModel);
        res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
});

// Get Orders Analytics (for Admin)
export const getOrdersAnalytics = CatchAsyncError(async (req, res, next) => {
    try {
        const orders = await generateLast12MonthsData(OrderModel);
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
});
