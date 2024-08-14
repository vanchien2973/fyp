import CatchAsyncError from "../middlewares/CatchAsyncError";
import UserModel from "../models/user.model";
import jwt from "jsonwebtoken";
require("dotenv").config();
import ejs from "ejs";
import ErrorHandler from "../utils/ErrorHandler";
import SendMail from "../utils/SendMail";
import {
    accessTokenOptions,
    refreshTokenOptions,
    sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import { getUserById } from "../services/user.service";
import cloudinary from "cloudinary";

// Register User
export const registerUser = CatchAsyncError(async (req, res, next) => {
    const { name, email, phoneNumber, password } = req.body;
    const isEmailExist = await UserModel.findOne({ email });

    if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
    }

    const user = { name, email, phoneNumber, password };
    const activationToken = createActivationToken(user);
    const activationCode = activationToken.activationCode;
    const data = { user: { name: user.name }, activationCode };

    const html = await ejs.renderFile(
        path.join(__dirname, "../mails/ActivationMail.ejs"),
        data,
    );
    // Send the activation email
    try {
        await SendMail({
            email: user.email,
            subject: "Activate Your Account",
            template: "ActivationMail.ejs",
            html,
        });

        res.status(201).json({
            success: true,
            message: `Please check your email: ${user.email} to activate your account!`,
            activationToken: activationToken.token,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 400));
    }
});

// Create Activation Token
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign(
        { user, activationCode },
        process.env.ACTIVATION_TOKEN_SECRET,
        { expiresIn: "10m" }
    );

    return { token, activationCode };
};

// Activate Account
export const activateUser = CatchAsyncError(async (req, res, next) => {
    const { activation_token, activation_code } = req.body;

    if (!activation_token || !activation_code) {
        return next(
            new ErrorHandler("Activation token and code are required!", 400)
        );
    }

    try {
        const newUser = jwt.verify(
            activation_token,
            process.env.ACTIVATION_TOKEN_SECRET
        );

        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler("Invalid Activation Code!", 400));
        }

        const { name, email, phoneNumber, password } = newUser.user;

        const existUser = await UserModel.findOne({ email });

        if (existUser) {
            return next(new ErrorHandler("User already exists!", 400));
        }

        await UserModel.create({ name, email, phoneNumber, password });

        res.status(201).json({
            success: true,
            message: "Account activated successfully!",
        });
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired activation token!", 400));
    }
});

// Login
export const loginUser = CatchAsyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Please provide email and password!", 400));
        }

        const user = await UserModel.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("Invalid email or password!", 400));
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invalid email or password!", 400));
        }

        sendToken(user, 200, res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Logout
export const logoutUser = CatchAsyncError(async (req, res, next) => {
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });

        // Clear the user session in Redis
        if (req.user && req.user._id) {
            await redis.del(req.user._id.toString());
        }

        res.status(200).json({
            success: true,
            message: "Logged out successfully!",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Update Access/Refresh Token
export const updateToken = CatchAsyncError(async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);

        if (!decoded) {
            return next(new ErrorHandler('Could not refresh token!', 401));
        };

        const session = await redis.get(decoded.id);

        if (!session) {
            return next(new ErrorHandler('Could not refresh token!', 400));
        };

        const user = JSON.parse(session);

        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "5m"
        });

        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "3d"
        });

        req.user = user;

        res.cookie("access_token", accessToken, accessTokenOptions);
        res.cookie("refresh_token", refreshToken, refreshTokenOptions);

        res.status(200).json({
            success: true,
            accessToken,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Get User Information
export const getUserInfo = CatchAsyncError(async (req, res, next) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return next(new ErrorHandler("User ID is required!", 400));
        }
        req.params.id = userId;
        getUserById(userId, res);
    } catch (error) {
        return next(new ErrorHandler("Unable to fetch user information!", 500));
    }
});

// Social Auth
export const socialAuth = CatchAsyncError(async (req, res, next) => {
    try {
        const { email, name, avatar } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            const newUser = await UserModel.create({
                email,
                name,
                avatar,
            });
            sendToken(newUser, 200, res);
        } else {
            sendToken(user, 200, res);
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Update User Profile
export const updateUser = CatchAsyncError(async (req, res, next) => {
    try {
        const { name, phoneNumber } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return next(new ErrorHandler("User ID not found in request", 400));
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found!", 404));
        }

        if (name) {
            user.name = name;
        }

        if (phoneNumber) {
            user.phoneNumber = phoneNumber;
        }

        await user?.save();
        await redis.set(userId, JSON.stringify(user));

        res.status(201).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Update User Password
export const updatePassword = CatchAsyncError(async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user?._id;

        if (!currentPassword || !newPassword) {
            return next(new ErrorHandler("Please enter old & new password!", 400));
        }

        if (!userId) {
            return next(new ErrorHandler("User ID not found in request", 400));
        }

        const user = await UserModel.findById(userId).select("+password");

        if (!user) {
            return next(new ErrorHandler("User not found!", 404));
        }

        const isPasswordMatch = await user?.comparePassword(currentPassword);

        if (!isPasswordMatch) {
            return next(new ErrorHandler("Current password is incorrect!", 400));
        }

        user.password = newPassword;
        await user.save();
        await redis.set(userId, JSON.stringify(user));

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Update User Avatar
export const updateAvatar = CatchAsyncError(async (req, res, next) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return next(new ErrorHandler("User ID not found in request", 400));
        }

        const { avatar } = req.body;

        if (!avatar) {
            return next(new ErrorHandler("Avatar is required!", 400));
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found!", 404));
        }

        // Upload to Cloudinary
        if (avatar && user) {
            // If user has an avatar
            if (user?.avatar?.public_id) {
                // Delete the old avatar
                await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

                // Upload new avatar
                const result = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                    crop: "scale",
                });
                user.avatar = {
                    public_id: result.public_id,
                    url: result.secure_url,
                };
            } else {
                const result = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                    crop: "scale",
                });
                user.avatar = {
                    public_id: result.public_id,
                    url: result.secure_url,
                };
            }
        }

        await user.save();
        await redis.set(userId, JSON.stringify(user));

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
