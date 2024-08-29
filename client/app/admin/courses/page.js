'use client'
import ListCourses from '@/app/components/Admin/courses/ListCourses';
import Topbar from '@/app/components/Admin/dashboard/Topbar';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import AdminProtected from '@/app/hooks/AdminProtected';
import Heading from '@/app/utils/Heading';
import React from 'react';

const page = () => {
  return (
    <div>
    <AdminProtected>
        <Heading
            title={`ELP - Admin`}
            description="LMS using MERN"
            keywords="MERN, Redux, Redis"
        />
        <div className='w-full h-full flex relative scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-500'>
            <AdminSidebar />
            <main className='w-full h-full'>
                <Topbar />
                <ListCourses />
            </main>
        </div>
    </AdminProtected>
</div>
  )
}

export default page;
