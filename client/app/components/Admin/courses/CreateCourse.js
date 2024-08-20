'use client'
import React, { useState } from 'react'
import CourseInformation from './CourseInformation';
import CourseOptions from './CourseOptions';
import { useTheme } from '@emotion/react';
import CourseData from './CourseData';
import CourseContent from './CourseContent';

const CreateCourse = () => {
    const theme = useTheme();
    const [active, setActive] = useState(2);
    const [courseInfor, setCourseInfor] = useState({
        name: '',
        description: '',
        price: '',
        estimatedPrice: '',
        thumbnail: '',
        tags: '',
        level: '',
        demoUrl: '',
    });
    const [benefits, setBenefits] = useState([{ title: '' }]);
    const [prerequisites, setPrerequisites] = useState([{ title: '' }]);
    const [courseContentData, setCourseContentData] = useState([{
        videoUrl: '',
        title: '',
        description: '',
        videoSection: 'Untitle Section',
        links: [{
            title: '',
            url: '',
        }],
        suggestion: '',
    }]);
    const [courseData, setCourseData] = useState({});
    
    const handleSubmit = async () => {

    }

    return (
        <div className='w-full flex min-h-screen'>
            <div className='w-[80%]'>
                {
                    active === 0 && (
                        <CourseInformation
                            courseInfor={courseInfor}
                            setCourseInfor={setCourseInfor}
                            active={active}
                            setActive={setActive}
                        />
                    )
                }
                {
                    active === 1 && (
                        <CourseData
                            benefits={benefits}
                            setBenefits={setBenefits}
                            prerequisites={prerequisites}
                            setPrerequisites={setPrerequisites}
                            active={active}
                            setActive={setActive}
                            handleSubmit={handleSubmit}
                        />
                    )
                }
                {
                    active === 2 && (
                        <CourseContent
                            courseContentData={courseContentData}
                            setCourseContentData={setCourseContentData}
                            active={active}
                            setActive={setActive}
                        />
                    )
                }
            </div>
            <div className='w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0'>
                <CourseOptions active={active} setActive={setActive} />
            </div>
        </div>
    )
}

export default CreateCourse;
