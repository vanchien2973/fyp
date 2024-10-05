import { useGetAllUserCoursesQuery } from '@/app/redux/features/courses/coursesApi';
import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import { ScrollArea } from '../ui/scroll-area';
import CourseCard from '../Layouts/CourseCard';
import { Card, CardContent } from '../ui/card';

const EnrolledCourse = ({ user }) => {
    const [courses, setCourses] = useState([]);
    const { data, isLoading } = useGetAllUserCoursesQuery(undefined, {});

    useEffect(() => {
        if (data && data.courses) {
            const filteredCourses = user.courses
                .map((userCourse) => data.courses.find((course) => course._id === userCourse._id))
                .filter((course) => course !== undefined);
            setCourses(filteredCourses)
        }
    }, [data])

    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <div className="w-full">
                            <CardContent className="p-5">
                                <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                                    {courses && courses.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                            {courses.map((course, index) => (
                                                <CourseCard
                                                    key={index}
                                                    course={course}
                                                    user={user}
                                                    isProfile={true}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-lg font-medium">
                                            You don't have any purchased courses!
                                        </p>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </div>
                    </>
                )
            }
        </>
    )
}

export default EnrolledCourse
