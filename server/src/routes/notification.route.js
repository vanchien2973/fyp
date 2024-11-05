import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middlewares/AuthMiddleware';
import { updateToken } from '../controllers/user.controller';
import { 
    getUserNotifications, 
    getSystemNotifications, 
    updateNotificationStatus, 
    deleteNotification 
} from '../controllers/notification.controller';

const notificationRouter = express.Router();

// Route for regular users
notificationRouter.get('/user-notifications', isAuthenticated, getUserNotifications);

// Routes for admin
notificationRouter.get('/system-notifications', isAuthenticated, authorizeRoles('admin'), getSystemNotifications);

// Routes for both users and admin
notificationRouter.put('/update-notification/:id', isAuthenticated, updateNotificationStatus);

notificationRouter.delete('/delete-notification/:id', isAuthenticated, deleteNotification);

export default notificationRouter;