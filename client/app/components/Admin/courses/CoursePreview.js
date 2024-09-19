import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import CourseVideoPlay from '../../../utils/CourseVideoPlay';
import Rating from '@/app/utils/Rating';
import { CircleCheck } from 'lucide-react';

const CoursePreview = ({ currentStep, setCurrentStep, courseData, handleCourse, isEdit }) => {
    const discountPercentage = ((courseData?.estimatedPrice - courseData?.price) / courseData?.estimatedPrice) * 100;
    const discountPercentagePrice = discountPercentage.toFixed(0);

    const prevButton = () => {
        setCurrentStep(currentStep - 1);
    }

    const handleCourses = () => {
        handleCourse();
    }

    return (
        <>
            <div className="w-full max-w-4xl mx-auto my-8">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">{courseData?.name}</CardTitle>
                    <CardDescription>
                        <div className="flex items-center space-x-2 mt-2">
                            <Rating rating={0} />
                            <span>0 Reviews</span>
                            <span>•</span>
                            <span>0 Students</span>
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                    <div className="aspect-video w-full">
                        <CourseVideoPlay
                            videoUrl={courseData?.demoUrl}
                            title={courseData?.title}
                        />
                    </div>
                    <div className="flex items-center space-x-5 mb-4 mt-4">
                        <span className="text-3xl font-bold">
                            {courseData?.price === 0 ? 'Free' : `$${courseData?.price}`}
                        </span>
                        <span className="text-lg line-through ml-2 text-gray-600">
                            ${courseData?.estimatedPrice}
                        </span>
                        <Badge variant="secondary" className="ml-2">
                            {discountPercentagePrice}% Off
                        </Badge>
                    </div>
                    <div className='mt-2'>
                            <Button className="w-[90%]" size='lg'>Buy Now ${courseData?.price}</Button>
                        </div>
                    <Separator />
                    <div>
                        <h3 className="font-semibold mb-2">Commitment to Quality</h3>
                        <ul className="list-disc list-inside mb-4">
                            <li>Commitment to ensure reputable zero-risk output</li>
                            <li>Complete learning material system</li>
                            <li>Personalized teaching methods</li>
                        </ul>
                    </div>
                    <Separator />
                    <div>
                        <h2 className="font-semibold mb-2">1. Details</h2>
                        <p className="whitespace-pre-line">{courseData?.description}</p>
                    </div>
                    <Separator />
                    <div>
                        <h2 className="font-semibold mb-2">2. Course Objectives</h2>
                        <ul className="list-disc list-inside mb-4">
                        {courseData?.benefits?.map((benefit, index) => (
                            <li key={index}>{benefit.title}</li>
                        ))}
                        </ul>
                    </div>
                    <Separator />
                    <div>
                        <h2 className="font-semibold mb-2">3. Course Information</h2>
                        <ul className="list-disc list-inside mb-4">
                        {courseData?.prerequisites?.map((prerequisite, index) => (
                            <li key={index}>{prerequisite.title}</li>
                        ))}
                        </ul>
                    </div>
                </CardContent>
            </div>
            {/* Navigation */}
            <div className="mt-8 pt-5">
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => prevButton()}
                        disabled={currentStep === 0}
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 19.5L8.25 12l7.5-7.5"
                            />
                        </svg>
                    </button>
                    <Button
                        type="button"
                        onClick={() => handleCourses()}
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {
                            isEdit ? 'Update' : 'Create'
                        }
                    </Button>
                </div>
            </div>
        </>
    );
}

export default CoursePreview;