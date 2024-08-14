'use client'
import React from 'react'
import Heading from '../utils/Heading';
import AdminProtected from '../hooks/AdminProtected';
import AdminSidebar from '../components/Admin/sidebar/AdminSidebar';
import Hero from '../components/Admin/dashboard/Hero';

const page = () => {

  return (
    <div>
      <AdminProtected>
        <Heading
          title={`ELP - Admin`}
          description="LMS using MERN"
          keywords="MERN, Redux, Redis"
        />
        <div className='flex h-[200vh]'>
          <div className='1500px:w-[16%] w-1/5'>
            <AdminSidebar/>
          </div>
          <div className='w-[85%]'>
            <Hero />
          </div>
        </div>
      </AdminProtected>
    </div>
  )
}
export default page;
