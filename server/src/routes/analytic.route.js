import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/AuthMiddleware";
import { updateToken } from "../controllers/user.controller";
import { getCoursesAnalytics, getOrdersAnalytics, getUsersAnalytics } from "../controllers/analytics.controller";

const analyticRouter = express.Router();

analyticRouter.get('/get-users-analytics', isAuthenticated, authorizeRoles('admin'), getUsersAnalytics);

analyticRouter.get('/get-courses-analytics', isAuthenticated, authorizeRoles('admin'), getCoursesAnalytics);

analyticRouter.get('/get-orders-analytics', isAuthenticated, authorizeRoles('admin'), getOrdersAnalytics);

export default analyticRouter;