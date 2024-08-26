import CatchAsyncError from '../middlewares/CatchAsyncError';
import OrderModel from '../models/order.model';

// Create New Order
export const createOrderService = CatchAsyncError(async (data, res, next) => {
    const order = await OrderModel.create(data);
    res.status(201).json({
        success: true,
        order,
    });
})