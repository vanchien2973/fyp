'use client'
import CourseDetail from '@/app/components/Course/CourseDetail'
import React from 'react'

const Page = ({ params }) => {

  return (
    <div>
      <CourseDetail id={params.id} />
    </div>
  )
}

export default Page
