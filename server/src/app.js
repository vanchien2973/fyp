import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import ErrorMiddleware from "./middlewares/Error";
import courseRouter from "./routes/course.route";
require('dotenv').config();

export const app = express();

// Body Parser
app.use(express.json({ limit: "50mb" }));

// Cookie Parser
app.use(cookieParser());

// Cors(Cross Origin Resource Sharing)
app.use(
    cors({
        origin: process.env.ORIGIN,
        credentials: true,
    })
);

// Routes
app.use("/api/v1", userRouter, courseRouter);

// Testings APIs
app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "APIs is working!",
    });
});

// Unknown Route
app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found!`);
    err.statusCode = 404;
    next(err);
});

// Error Middleware
app.use(ErrorMiddleware);

