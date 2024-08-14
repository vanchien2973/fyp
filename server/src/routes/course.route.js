import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/AuthMiddleware";
import { uploadCourse } from "../controllers/course.controller";

const courseRouter = express.Router();

courseRouter.post("/create-course", isAuthenticated, authorizeRoles("admin"), uploadCourse);

export default courseRouter;