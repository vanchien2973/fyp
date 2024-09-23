'use client'
import CourseContent from '@/app/components/Course/CourseContent';
import Loader from '@/app/components/Loader/Loader';
import PageContainer from '@/app/components/ui/page-container';
import { useLoadUserQuery } from '@/app/redux/features/api/apiSlice';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'

const page = ({ params }) => {
  const id = params.id;
  const { isLoading, error, data } = useLoadUserQuery(undefined, {});

  useEffect(() => {
    if (data) {
      const isPurchased = data.user.courses.find((item) => item._id === id);
      if (!isPurchased) {
        redirect('/')
      }
      if (error) {
        redirect('/')
      }
    }
  }, [data, error])

  return (
    <>
      {
        isLoading ? (
          <Loader />
        ) : (
          <PageContainer scrollable={true}>
            <CourseContent id={id} user={data.user} />
          </PageContainer>
        )
      }
    </>
  )
}

export default page
