'use client'
import React from 'react'
import Heading from '../utils/Heading';
import AdminProtected from '../hooks/AdminProtected';
import AdminSidebar from '../components/Admin/sidebar/AdminSidebar';
import Hero from '../components/Admin/dashboard/Hero';

const page = () => {
  return (
    <>
      <AdminProtected>
        <Heading
          title={`ELP - Admin`}
          description="LMS using MERN"
          keywords="MERN, Redux, Redis"
        />
        <div className='w-full h-full flex relative scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-500'>
          <AdminSidebar />
          <main className='w-full h-full'>
            <Hero />
          </main>
        </div>
      </AdminProtected>
    </>
  )
}
export default page;

