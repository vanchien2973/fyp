import CatchAsyncError from '../middlewares/CatchAsyncError';
import OrderModel from '../models/order.model';

// Create New Order
export const createOrderService = CatchAsyncError(async (data, res, next) => {
    const order = await OrderModel.create(data);
    res.status(201).json({
        success: true,
        order,
    });
});

// Get All Orders
export const getAllOrdersService = CatchAsyncError(async (res) => {
    const orders = await OrderModel.find().sort({ createAt: - 1 });
    res.status(201).json({
        success: true,
        orders,
    });
});