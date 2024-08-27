import CatchAsyncError from "../middlewares/CatchAsyncError";
import { redis } from "../utils/redis";
import UserModel from '../models/user.model';

// Get User by ID
export const getUserById = CatchAsyncError(async (id, res) => {
        const userJson = await redis.get(id);
        if (userJson) {
            const user = JSON.parse(userJson);
            res.status(200).json({
                success: true,
                user,
            });
        }
});

// Get All Users
export const getAllUsersService = CatchAsyncError(async (res) => {
    const users = await UserModel.find().sort({ createAt: - 1 });
    res.status(201).json({
        success: true,
        users,
    });
});

// Assign Role for User
export const assignRoleService = CatchAsyncError(async (res, id, role) => {
    const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true });
    res.status(201).json({
        success: true,
        user,
    })
});