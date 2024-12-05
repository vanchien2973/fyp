import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/AuthMiddleware";
import { createNewPayment, createOrder, getAllOrdersInSystem, sendStripePublishableKey } from "../controllers/order.controller";
import { updateToken } from "../controllers/user.controller";

const orderRouter = express.Router();

orderRouter.post('/create-order', isAuthenticated, updateToken, createOrder);

orderRouter.get('/get-all-orders', isAuthenticated, authorizeRoles('admin'), getAllOrdersInSystem);

orderRouter.get('/payment/stripepublishablekey', sendStripePublishableKey);

orderRouter.post('/payment', isAuthenticated, createNewPayment);

export default orderRouter;