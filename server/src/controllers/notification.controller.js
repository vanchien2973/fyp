import CatchAsyncError from "../middlewares/CatchAsyncError";
import NotificationModel from "../models/notification.model";
import ErrorHandler from "../utils/ErrorHandler";

// Get All Notifications
export const getNotifications = CatchAsyncError(async (req, res, next) => {
    try {
        const notifications = await NotificationModel.find().sort({ createAt: - 1});
        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Update Notification Status (for Admin )
export const updateNotificationStatus = CatchAsyncError(async (req, res, next) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);
        if (!notification) {
            return next(new ErrorHandler('Notification not found', 404));
        } else {
            notification.status ? notification.status = 'read' : notification?.status;
        }
        await notification.save();

        const notifications = await NotificationModel.find().sort({ createAt: - 1});
        res.status(200).json({
            success: true,
            notifications
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});