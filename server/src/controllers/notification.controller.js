import CatchAsyncError from "../middlewares/CatchAsyncError";
import NotificationModel from "../models/notification.model";
import ErrorHandler from "../utils/ErrorHandler";
import cron from 'node-cron';

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

// Delete Notification (for Admin)
export const deleteNotification = CatchAsyncError(async (req, res, next) => {
    try {
        const notificationId = req.params.id
        const notification = await NotificationModel.findById(notificationId);
        if (!notification) {
            return next(new ErrorHandler('Notification not found', 404));
        }
        await notification.deleteOne({ notificationId });

        const notifications = await NotificationModel.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully',
            notifications
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Delete Notification (for Admin)
cron.schedule('0 0 0 * * *', async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await NotificationModel.deleteMany({ status: 'read', createdAt: { $lt: thirtyDaysAgo } });
});