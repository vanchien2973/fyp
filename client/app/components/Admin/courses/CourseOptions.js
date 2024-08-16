'use client'
import React from 'react';
import { IoMdCheckmark } from 'react-icons/io';

const CourseOptions = ({ active, setActive }) => {
    const options = [
        'Information',
        'Options',
        'Content',
        'Preview'
    ]
    return (
        <div>
            {options.map((option, index) => (
                <div key={index} className={`w-full flex py-5`}>
                    <div className={`w-[35px] h-[35px] rounded-full flex items-center justify-center ${active + 1 > index ? 'bg-[#58c4dc]' : 'bg-[#343a46]'
                        } relative`}>
                        <IoMdCheckmark className='text-25px' />
                        {index !== options.length - 1 && (
                            <div className={`absolute h-[30px] w-1 ${active + 1 > index ? 'bg-[#58c4dc]' : 'bg-[#343a46]'
                                } bottom-[-100%]`} />
                        )}
                    </div>
                    <h5 className='pl-3 text-[18px]'>
                        {option}
                    </h5>
                </div>
            ))}
        </div>
    )
}

export default CourseOptions;
