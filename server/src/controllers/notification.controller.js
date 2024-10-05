import CatchAsyncError from "../middlewares/CatchAsyncError";
import NotificationModel from "../models/notification.model";
import UserModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import cron from 'node-cron';

// Get Notifications for a User
export const getUserNotifications = CatchAsyncError(async (req, res, next) => {
    try {
        const notifications = await NotificationModel.find({ recipient: req.user._id })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get All System Notifications (for Admin)
export const getSystemNotifications = CatchAsyncError(async (req, res, next) => {
    try {
        const notifications = await NotificationModel.find({ type: 'system' })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Update Notification Status
export const updateNotificationStatus = CatchAsyncError(async (req, res, next) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);
        
        if (!notification) {
            return next(new ErrorHandler('Notification not found', 404));
        }
        
        notification.status = 'read';
        await notification.save();

        res.status(200).json({
            success: true,
            message: 'Notification status updated successfully'
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Delete Notification
export const deleteNotification = CatchAsyncError(async (req, res, next) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);
        
        if (!notification) {
            return next(new ErrorHandler('Notification not found', 404));
        }

        await notification.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Create a new notification
export const createNotification = CatchAsyncError(async (recipientId, title, message, type) => {
    try {
        await NotificationModel.create({
            recipient: recipientId,
            title,
            message,
            type
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
});

// Cron job to delete old read notifications
cron.schedule('0 0 * * *', async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await NotificationModel.deleteMany({ 
        status: 'read', 
        createdAt: { $lt: thirtyDaysAgo } 
    });
});