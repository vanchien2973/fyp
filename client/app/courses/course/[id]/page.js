'use client'
import CourseDetail from '@/app/components/Course/CourseDetail'
import React from 'react'

const page = ({ params }) => {
  return (
    <div>
      <CourseDetail id={params.id}/>
    </div>
  )
}

export default page
