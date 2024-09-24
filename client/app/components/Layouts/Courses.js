import { useGetAllUserCoursesQuery } from '@/app/redux/features/courses/coursesApi'
import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import CourseCard from './CourseCard';
import { Button } from '../ui/button';
import Link from 'next/link';

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
                            <div className="container px-4 md:px-6">
                                <div className="grid gap-8">
                                    <div className="grid gap-2 text-center">
                                        <h2 className="text-2xl font-bold md:text-3xl tracking-tight">
                                            Popular Courses {''}
                                        </h2>
                                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                                            Discover our highest-rated courses to accelerate your English learning journey.
                                        </p>
                                    </div>
                                    <div className="grid gap-6 ">
                                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                            {courses &&
                                                courses.map((course, index) => (
                                                    <CourseCard course={course} key={index} />
                                                ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
                                            <div className="w-full max-w-lg lg:w-auto">
                                                <Button size="lg">
                                                    <Link href="/courses">
                                                        View Courses
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
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
