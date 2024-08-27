import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/AuthMiddleware";
import { createOrder, getAllOrdersInSystem } from "../controllers/order.controller";
import { updateToken } from "../controllers/user.controller";

const orderRouter = express.Router();

orderRouter.post('/create-order', updateToken, isAuthenticated, createOrder);

orderRouter.get('/get-all-orders', updateToken, isAuthenticated, authorizeRoles('admin'), getAllOrdersInSystem);

export default orderRouter;