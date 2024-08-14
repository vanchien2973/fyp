import CatchAsyncError from "../middlewares/CatchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { redis } from "../utils/redis";

// Get User by ID
export const getUserById = CatchAsyncError(async (id, res) => {
        // Attempt to retrieve the user from Redis
        const userJson = await redis.get(id);

        if (userJson) {
            // User found in Redis, parse the JSON and return the user
            const user = JSON.parse(userJson);
            res.status(200).json({
                success: true,
                user,
            });
        }
});
