import CatchAsyncError from '../middlewares/CatchAsyncError';
import CourseModel from '../models/course.model';

// Create Course
export const createCourse = CatchAsyncError(async (data, res) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
        success: true,
        course
    });
});

// Get All Courses
export const getAllCoursService = CatchAsyncError(async (res) => {
    const courses = await CourseModel.find().sort({ createAt: - 1 });
    res.status(201).json({
        success: true,
        courses,
    });
});
