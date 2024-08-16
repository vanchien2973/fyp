'use client'
import { styles } from '@/app/styles/styles';
import React, { useState } from 'react'

const CourseInformation = ({ courseInfor, setCourseInfor, active, setActive }) => {
  const [dragging, setDragging] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setActive(active + 1);
  }

  return (
    <div className='w-[80%] m-auto mt-24'>
      <form onSubmit={handleSubmit}>
        <div class="mb-6">
          <label htmlFor='' class="block mb-2 text-sm font-medium">Name</label>
          <input 
            type='name'
            name=''
            required
            value={courseInfor.name}
            onChange={(e) => setCourseInfor({ ...courseInfor, name: e.target.value })}
            id='name'
            className="border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5" />
        </div>
        <div class="mb-6">
          <label htmlFor='' class="block mb-2 text-sm font-medium">Description</label>
          <textarea
            name=''
            id=''
            cols={30}
            rows={8}
            value={courseInfor.description}
            required
            onChange={(e) => setCourseInfor({ ...courseInfor, description: e.target.value })}
            className="border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5" />
        </div>
      </form>
    </div>
  )
}

export default CourseInformation;
