import ErrorHandler from "../utils/ErrorHandler";
import { redis } from "../utils/redis";
import CatchAsyncError from "./CatchAsyncError";
import jwt from "jsonwebtoken";

// Authenticated
export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
        const access_token = req.cookies.access_token;
        const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);

        if (!decoded) {
            return next(new ErrorHandler('Access token is not valid', 401));
        }

        const user = await redis.get(decoded.id);

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }
        
        req.user = JSON.parse(user);
        
        next();
});

// Validate User Role
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role || '')) {
            return next(new ErrorHandler(`Role: ${req.user?.role} do not have permission to access this resource!`, 403));
        }
        next();
    };
};