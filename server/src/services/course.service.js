import CatchAsyncError from '../middlewares/CatchAsyncError';
import CourseModel from '../models/course.model';
import redis from '../utils/redis';

// Create Course
export const createCourse = CatchAsyncError(async (data, res) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
        success: true,
        course
    });
});