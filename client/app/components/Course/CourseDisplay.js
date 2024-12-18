import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from '../ui/badge';
import Rating from '@/app/utils/Rating';
import { format } from 'timeago.js';
import CourseVideoPlay from '@/app/utils/CourseVideoPlay';
import Link from 'next/link';
import CourseContentList from './CourseContentList';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../Payment/CheckoutForm';
import { UserAvatar } from '../ui/avatar';
import { useLoadUserQuery } from '@/app/redux/features/api/apiSlice';
import { useEffect } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../ui/pagination"

const CourseDisplay = ({ data, clientSecret, stripePromise, setRoute, setOpen: openAuthModal }) => {
    const { data: userData } = useLoadUserQuery(undefined, {});
    const [user, setUser] = useState();
    const [open, setOpen] = useState(false);
    const discountPercentage = ((data?.estimatedPrice - data?.price) / data?.estimatedPrice) * 100;
    const discountPercentagePrice = discountPercentage.toFixed(0);
    const isPurchased = user && user?.courses?.find((item) => item._id === data?._id);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

    useEffect(() => {
        setUser(userData?.user)
    }, [userData])

    const handleOrder = (e) => {
        if (user) {
            setOpen(true);
        } else {
            setRoute('Login');
            openAuthModal(true);
        }
    }

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    // Calculate pagination
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = data?.reviews?.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil((data?.reviews?.length || 0) / reviewsPerPage);

    // Generate page numbers
    const pageNumbers = [];
    if (totalPages <= 3) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        pageNumbers.push(1);
        if (currentPage > 2) pageNumbers.push('...');
        if (currentPage > 1 && currentPage < totalPages) pageNumbers.push(currentPage);
        if (currentPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
    }
    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };


    return (
        <>
            <div className='w-[90%] 800px:w-[90%] m-auto py-2'>
                <div className='w-full flex flex-col-reverse 800px:flex-row'>
                    <div className='w-full 800px:w-[65%] 800px:pr-5'>
                        <div className="container mx-auto p-4">
                            <div className="mb-8">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-2xl font-bold">{data?.name}</CardTitle>
                                            <div className="flex items-center mt-2">
                                                <Rating rating={data?.rating} />
                                                <span className="ml-2 text-sm text-gray-600">{data?.reviews.length} Reviews<span className="ml-2 text-sm text-black dark:text-white">({data?.purchased} Students)</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <h3 className="font-semibold mb-2">1. Details</h3>
                                    <p className="mb-4">{data?.description}</p>

                                    <h3 className="font-semibold mb-2">2. Objectives</h3>
                                    <ul className="list-disc list-inside mb-4">
                                        {data?.benefits?.map((benefit, index) => (
                                            <li key={index}>{benefit.title}</li>
                                        ))}
                                    </ul>

                                    <h3 className="font-semibold mb-2">3. Information</h3>
                                    <ul className="list-disc list-inside mb-4">
                                        {data?.prerequisites?.map((prerequisite, index) => (
                                            <li key={index}>{prerequisite.title}</li>
                                        ))}
                                    </ul>

                                    <h3 className="font-semibold mb-2">4. Overview</h3>
                                    <CourseContentList data={data?.courseData} isDemo={true} />
                                </CardContent>
                            </div>
                            <CardHeader>
                                <CardTitle>Reviews</CardTitle>
                                <CardDescription>
                                    {Number.isInteger(data?.ratings)
                                        ? data?.ratings.toFixed(1)
                                        : data?.ratings?.toFixed(2)}{' '}
                                    Ratings - {data?.reviews?.length || 0} Reviews
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {currentReviews && currentReviews.length > 0 &&
                                    currentReviews.map((review, index) => (
                                        <div key={review._id || index} className="flex items-center mb-4">
                                            <UserAvatar
                                                user={review.user}
                                                className="h-10 w-10"
                                            />
                                            <div className="ml-4">
                                                <p className="font-semibold">{review.user.name}</p>
                                                <div className="flex items-center">
                                                    <Rating rating={review.rating} />
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        {format(new Date(review.createdAt), 'PPP')}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">{review.comment}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </CardContent>
                            <CardFooter>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={handlePrevPage}
                                                disabled={currentPage === 1}
                                            />
                                        </PaginationItem>
                                        {pageNumbers.map((number, index) => (
                                            <PaginationItem key={index}>
                                                {number === '...' ? (
                                                    <PaginationEllipsis />
                                                ) : (
                                                    <PaginationLink
                                                        onClick={() => setCurrentPage(number)}
                                                        isActive={currentPage === number}
                                                    >
                                                        {number}
                                                    </PaginationLink>
                                                )}
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={handleNextPage}
                                                disabled={currentPage === totalPages}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </CardFooter>
                        </div>
                    </div>
                    <div className='w-full 800px:w-[35%] relative'>
                        <div className='top-[100px] left-0 z-50 w-full'>
                            <CourseVideoPlay
                                videoUrl={data?.demoUrl}
                                title={data?.title}
                            />
                            <div className="flex items-center space-x-5 mb-4 mt-4">
                                <span className="text-3xl font-bold">
                                    {data?.price === 0 ? 'Free' : `$${data?.price}`}
                                </span>
                                <span className="text-lg line-through ml-2 text-gray-600">
                                    ${data?.estimatedPrice}
                                </span>
                                <Badge variant="secondary" className="ml-2">
                                    {discountPercentagePrice}% Off
                                </Badge>
                            </div>
                            <div className='mt-2'>
                                {
                                    isPurchased ? (
                                        <Link href={`/courses/course-access/${data._id}`} className="block mt-2">
                                            <Button className="w-full" size='lg'>Enter to Course</Button>
                                        </Link>
                                    ) : (
                                        <Button className="w-full" size='lg' onClick={handleOrder}>Buy Now ${data?.price}</Button>
                                    )
                                }
                            </div>
                            <div className='mt-4'>
                                <h3 className="font-semibold mb-2">Commitment to Quality</h3>
                                <ul className="list-disc list-inside mb-4">
                                    <li>Commitment to ensure reputable zero-risk output</li>
                                    <li>Complete learning material system</li>
                                    <li>Personalized teaching methods</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {open && stripePromise && clientSecret && (
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm isOpen={open} setOpen={setOpen} data={data} user={user} />
                </Elements>
            )}
        </>
    );
}

export default CourseDisplay;