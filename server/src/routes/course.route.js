import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/AuthMiddleware";
import { addAnswer, addQuestion, addReplyForReview, addReview, deleteCourse, editCourse, generateVideoUrl, getAllCourses, getAllCoursesInSystem, getCourseByUser, getSingleCourse, uploadCourse } from "../controllers/course.controller";
import { updateToken } from "../controllers/user.controller";

const courseRouter = express.Router();

courseRouter.post("/create-course", updateToken, isAuthenticated, authorizeRoles("admin"), uploadCourse);

courseRouter.put("/edit-course/:id", updateToken, isAuthenticated, authorizeRoles("admin"), editCourse);

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.get("/get-course-content/:id", updateToken, isAuthenticated, getCourseByUser);

courseRouter.put("/add-question", updateToken, isAuthenticated, addQuestion);

courseRouter.put("/add-answer", updateToken, isAuthenticated, addAnswer);

courseRouter.put("/add-review/:id", updateToken, isAuthenticated, addReview);

courseRouter.put("/add-reply-review", updateToken, isAuthenticated, authorizeRoles('admin'), addReplyForReview);

courseRouter.post("/getVdoCipherOtp", generateVideoUrl);

courseRouter.get("/get-all-courses", updateToken, isAuthenticated, authorizeRoles('admin'), getAllCoursesInSystem);

courseRouter.delete("/delete-course/:id", updateToken, isAuthenticated, authorizeRoles('admin'), deleteCourse);

export default courseRouter;