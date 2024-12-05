'use client'
import CourseContent from '@/app/components/Course/CourseContent';
import Loader from '@/app/components/Loader/Loader';
import { useLoadUserQuery } from '@/app/redux/features/api/apiSlice';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = ({ params }) => {
    const id = params.id;
    const { isLoading, error, data } = useLoadUserQuery(undefined, {});
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (data?.user) {
            if (data.user.role === 'admin') {
                setIsAuthorized(true);
                return;
            }
            const isPurchased = data.user.courses?.find((item) => item._id === id);
            if (!isPurchased) {
                redirect('/');
            } else {
                setIsAuthorized(true);
            }
        }
    }, [data, id]);

    useEffect(() => {
        if (error) {
            redirect('/');
        }
    }, [error]);

    if (isLoading || !data) {
        return <Loader />;
    }

    return isAuthorized ? <CourseContent id={id} user={data?.user} /> : null;
}

export default Page;
