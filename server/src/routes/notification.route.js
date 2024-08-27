import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middlewares/AuthMiddleware';
import { updateToken } from '../controllers/user.controller';
import { getNotifications, updateNotificationStatus } from '../controllers/notification.controller';

const notificationRouter = express.Router();

notificationRouter.get('/get-all-notifications', updateToken, isAuthenticated, authorizeRoles('admin'), getNotifications);

notificationRouter.put('/update-notification-status/:id', updateToken, isAuthenticated, authorizeRoles('admin'), updateNotificationStatus)

export default notificationRouter;