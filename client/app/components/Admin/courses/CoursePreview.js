import React from 'react'
import CourseVideoPlay from '../../../utils/CourseVideoPlay';
import { styles } from '@/app/styles/styles';

const CoursePreview = ({ active, setActive, courseData, handleCourseCreate }) => {
    const discountPercentage = ((courseData?.estimatedPrice - courseData?.price) / courseData?.estimatedPrice) * 100;
    const discountPercentagePrice = discountPercentage.toFixed(0)
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
                <div>
                    <strong className='pb-1 text-[16px]'>Commitment to Quality:</strong>
                    <ul className='pb-1'>
                        <li className='pb-1'>• Commitment to ensure reputable zero-risk output</li>
                        <li className='pb-1'>• Complete learning material system</li>
                        <li className='pb-1'>• Personalized teaching methods</li>
                    </ul>
                </div>
            </div>
            <div className='w-full'>
                <h1 className='text-[25px]'>{courseData?.name}</h1>
                <div className='flex items-center justify-between pt-3'>
                    <div className='flex items-center'>
                        <Rating rating={0}/>
                        <h5 className='pl-3 mt-2'>0 Reviews</h5>
                    </div>
                    <h5 className='pl-3 mt-2'>0 Students</h5>
                </div>
            </div>
        </div>
    )
}

export default CoursePreview;
