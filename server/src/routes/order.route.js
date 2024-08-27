import express from "express";
import { isAuthenticated } from "../middlewares/AuthMiddleware";
import { createOrder } from "../controllers/order.controller";
import { updateToken } from "../controllers/user.controller";

const orderRouter = express.Router();

orderRouter.post('/create-order', updateToken, isAuthenticated, createOrder)

export default orderRouter;