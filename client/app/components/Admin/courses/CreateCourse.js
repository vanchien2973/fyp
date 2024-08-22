'use client'
import React, { useState } from 'react'
import CourseInformation from './CourseInformation';
import CourseOptions from './CourseOptions';
import { useTheme } from '@emotion/react';
import CourseData from './CourseData';
import CourseContent from './CourseContent';
import CoursePreview from './CoursePreview';

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
        videoSection: 'Untitled Section',
        links: [{
            title: '',
            url: '',
        }],
        suggestion: '',
    }]);
    const [courseData, setCourseData] = useState({});
    
    const handleSubmit = async () => {
        // Format Benefits Array
        const formattedBenefits = benefits.map((benefit) => ({ title: benefit.title }));
        // Format Prerequisites Array
        const formattedPrerequisites = prerequisites.map((prerequisite) => ({ title: prerequisite.title }));
        // Format Course Content Array
        const formattedCourseContent = courseContentData.map((courseContent) => ({
            videoUrl: courseContent.videoUrl,
            title: courseContent.title,
            description: courseContent.description,
            videoSection: courseContent.videoSection,
            links: courseContent.links.map((link) => ({
                title: link.title,
                url: link.url,
            })),
            suggestion: courseContent.suggestion,
        }));
        // Prepare Course Data Object
        const data = {
            name: courseInfor.name,
            description: courseInfor.description,
            price: courseInfor.price,
            estimatedPrice: courseInfor.estimatedPrice,
            thumbnail: courseInfor.thumbnail,
            tags: courseInfor.tags,
            level: courseInfor.level,
            demoUrl: courseInfor.demoUrl,
            totalVideos: courseContentData.length,
            benefits: formattedBenefits,
            prerequisites: formattedPrerequisites,
            courseContent: formattedCourseContent,
        };
        console.log(data)
        setCourseData(data);
    };
    
    const handleCourseCreate = async (e) => {
        const data = courseData;
    };

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
                            handleSubmit={handleSubmit}
                        />
                    )
                }
                {
                    active === 3 && (
                        <CoursePreview
                            active={active}
                            setActive={setActive}
                            courseData={courseData}
                            handleCourseCreate={handleCourseCreate}
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