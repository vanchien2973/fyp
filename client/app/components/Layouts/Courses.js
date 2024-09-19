import { useGetAllUserCoursesQuery } from '@/app/redux/features/courses/coursesApi'
import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import CourseCard from './CourseCard';

const Courses = () => {
    const { data, isLoading } = useGetAllUserCoursesQuery({});
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (data && data.courses) {
            const sortedCourses = [...data.courses].sort((a, b) => b.ratings - a.ratings);
            setCourses(sortedCourses.slice(0, 4));
        }
    }, [data]);

    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <section className="py-24 px-4 sm:px-6 lg:px-8">
                            <div className="container mx-auto">
                                <div className="text-center mb-16">
                                    <h2 className="text-2xl font-bold md:text-3xl tracking-tight">
                                        Popular Courses {''}
                                    </h2>
                                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                                        Discover our highest-rated courses to accelerate your English learning journey.
                                    </p>
                                </div>
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    {
                                        courses && courses.map((course, index) => (
                                            <CourseCard course={course} key={index} />
                                        ))
                                    }
                                </div>
                            </div>
                        </section>
                    </>
                )
            }
        </>
    )
}

export default Courses
