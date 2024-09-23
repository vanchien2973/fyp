'use client'
import CourseDetail from '@/app/components/Course/CourseDetail'
import PageContainer from '@/app/components/ui/page-container'
import React from 'react'

const page = ({ params }) => {
  return (
    <div>
      <PageContainer scrollable={true}>
        <CourseDetail id={params.id} />
      </PageContainer>
    </div>
  )
}

export default page
