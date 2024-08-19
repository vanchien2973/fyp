'use client'
import React from 'react';
import { AddCircleOutline } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

const CourseData = ({ benefits, setBenefits, prerequisites, setPrerequisites, active, setActive }) => {
    const handleBenefitChange = (index, value) => {
        const updateBenefitChange = [...benefits];
        updateBenefitChange[index].title = value;
        setBenefits(updateBenefitChange);
    }

    const handleAddBenefit = () => {
        setBenefits([...benefits, { title: '' }]);
    }

    const handlePrerequisitesChange = (index, value) => {
        const updatePrerequisitesChange = [...prerequisites];
        updatePrerequisitesChange[index].title = value;
        setPrerequisites(updatePrerequisitesChange);
    }

    const handleAddPrerequisites = () => {
        setPrerequisites([...prerequisites, { title: '' }]);
    }

    const prevButton = () => {
        if (active > 0) {
            setActive(active - 1);
        }
    }

    const handleOptions = () => {
        const lastBenefitEmpty = benefits.length > 0 && benefits[benefits.length - 1].title === '';
        const lastPrerequisiteEmpty = prerequisites.length > 0 && prerequisites[prerequisites.length - 1].title === '';

        if (lastBenefitEmpty || lastPrerequisiteEmpty) {
            toast.error("Please fill all fields before proceeding!");
        } else {
            setActive(active + 1);
        }
    }

    return (
        <div className="w-[80%] m-auto mt-24">
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2" htmlFor="name">Course Object</label>
                {benefits.map((benefit, index) => (
                    <input
                        type="text"
                        key={index}
                        name={`Benefit-${index}`}
                        required
                        className="w-full mt-4 p-2 border border-[#343a46] dark:border-black rounded dark:bg-transparent dark:border-dark-700 bg-transparent"
                        value={benefit.title}
                        onChange={(e) => handleBenefitChange(index, e.target.value)}
                    />
                ))}
                <AddCircleOutline
                    style={{ margin: '10px 0', cursor: 'pointer', width: '30px' }}
                    onClick={handleAddBenefit}
                />
            </div>
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2" htmlFor="name">Prerequisites</label>
                {prerequisites.map((prerequisite, index) => (
                    <input
                        type="text"
                        key={index}
                        name={`Prerequisite-${index}`}
                        required
                        className="w-full mt-4 p-2 border border-[#343a46] dark:border-black rounded dark:bg-transparent dark:border-dark-700 bg-transparent"
                        value={prerequisite.title}
                        onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
                    />
                ))}
                <AddCircleOutline
                    style={{ margin: '10px 0', cursor: 'pointer', width: '30px' }}
                    onClick={handleAddPrerequisites}
                />
            </div>
            <div className='mb-6'>
                <div className='flex justify-between items-center'>
                    <button
                        className="px-4 py-2 bg-[#58c4dc] rounded text-white mt-4 cursor-pointer dark:bg-[#58c4dc] disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={prevButton}
                        disabled={active === 0}
                    >
                        Prev
                    </button>
                    <button
                        className="px-4 py-2 bg-[#58c4dc] rounded text-white mt-4 cursor-pointer dark:bg-[#58c4dc]"
                        onClick={handleOptions}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CourseData;