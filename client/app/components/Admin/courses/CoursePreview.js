import React from 'react';
import CourseVideoPlay from '../../../utils/CourseVideoPlay';
import { styles } from '@/app/styles/styles';
import Rating from '@/app/utils/Rating';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';

const CoursePreview = ({ active, setActive, courseData, handleCourseCreate }) => {
    const discountPercentage = ((courseData?.estimatedPrice - courseData?.price) / courseData?.estimatedPrice) * 100;
    const discountPercentagePrice = discountPercentage.toFixed(0);

    const prevButton = () => {
        setActive(active - 1);
    }

    const createCourse = () => {
        handleCourseCreate();
    }

    return (
        <div className='w-[90%] m-auto py-5 mb-5'>
            <div className='w-full relative'>
                <div className='w-full mt-10'>
                    <CourseVideoPlay
                        videoUrl={courseData?.demoUrl}
                        title={courseData?.title}
                    />
                </div>
                <div className='flex items-center'>
                    <h1 className='pt-5 text-[25px]'>
                        {courseData?.price === 0 ? 'Free' : courseData?.price + '$'}
                    </h1>
                    <h5 className='pl-3 text-[20px] mt-2 line-through opacity-80'>
                        {courseData?.estimatedPrice}$
                    </h5>
                    <h4 className='pl-4 pt-4 text-[22px]'>
                        {discountPercentagePrice}% Off
                    </h4>
                </div>
                <div className='flex items-center'>
                    <div className={`${styles.button} !w-[180px] my-3 cursor-not-allowed`}>
                        Buy Now {courseData?.price}$
                    </div>
                </div>
                <div className='flex items-center'>
                    <input
                        type="text"
                        className="w-full mt-1 p-2 border border-[#343a46] rounded bg-transparent"
                        name=''
                        id=''
                        placeholder='Discount Code'
                    />
                    <div className={`${styles.button} !w-[180px] my-3 ml-4 cursor-pointer`}>
                        Apply
                    </div>
                </div>
                <div className='mb-6'>
                    <h3 className='text-xl font-semibold mb-2'>Commitment to Quality:</h3>
                    <ul className='list-disc pl-5 space-y-1'>
                        <li>Commitment to ensure reputable zero-risk output</li>
                        <li>Complete learning material system</li>
                        <li>Personalized teaching methods</li>
                    </ul>
                </div>
                <div className='w-full'>
                    <h1 className='text-[25px]'>{courseData?.name}</h1>
                    <div className='flex items-center justify-between pt-3'>
                        <div className='flex items-center'>
                            <Rating rating={0} />
                            <h5 className='pl-3 mt-2'>0 Reviews</h5>
                        </div>
                        <h5 className='pl-3 mt-2'>0 Students</h5>
                    </div>
                    <h1 className='text-[25px] mt-3 font-[600]'>
                        What will you learn from this course?
                    </h1>
                </div>
                {
                    courseData?.benefits?.map((item, index) => (
                        <div className='w-full flex py-2 800px:items-center' key={index}>
                            <div className='w-[15px] mr-1'>
                                <IoCheckmarkDoneOutline size={20} />
                            </div>
                            <p className='pl-2'>{item.title}</p>
                        </div>
                    ))
                }
                <div className='w-full'>
                    <h1 className='text-[25px] mt-3 font-[600]'>
                        Course Details
                    </h1>
                    <p className='text-[16px] mt-[20px] whitespace-pre-line w-full overflow-hidden'>
                        {courseData?.description}
                    </p>
                </div>
            </div>
            <div className='mb-6 mt-3'>
                <div className='flex justify-between items-center'>
                    <button
                        className="px-4 py-2 bg-[#58c4dc] rounded text-white mt-4 cursor-pointer dark:bg-[#58c4dc] disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => prevButton()}
                    >
                        Prev
                    </button>
                    <button
                        className="px-4 py-2 bg-[#58c4dc] rounded text-white mt-4 cursor-pointer dark:bg-[#58c4dc]"
                        onClick={() => createCourse()}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CoursePreview;
