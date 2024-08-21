import React from 'react'
import CourseVideoPlay from './CourseVideoPlay';

const CoursePreview = ({ active, setActive, courseData, handleCourseCreate }) => {
    return (
        <div className='w-[90%] m-auto py-5 mb-5'>
            <div className='w-full relative'>
                <div className='w-full mt-10'>
                    <CourseVideoPlay 
                        videoUrl={courseData?.demoUrl} 
                        title={courseData?.title}
                        // description={courseData?.description}
                        // duration={courseData?.duration}
                        // handleCourseCreate={handleCourseCreate}
                    />
                </div>
            </div>
        </div>
    )
}

export default CoursePreview;
