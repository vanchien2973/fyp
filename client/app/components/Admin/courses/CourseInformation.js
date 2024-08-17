'use client';
import React, { useState } from 'react';

const CourseInformation = ({ courseInfor, setCourseInfor, active, setActive }) => {
  const [dragging, setDragging] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setActive(active + 1);
  };

  return (
    <div className="w-[80%] m-auto mt-24 dark:bg-dark-900">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" htmlFor="">Course Name</label>
          <input
            type="text"
            id="name"
            value={courseInfor.name}
            onChange={(e) => setCourseInfor({ ...courseInfor, name: e.target.value })}
            className="w-full p-2 border border-[#343a46] dark:border-black rounded dark:bg-transparent dark:border-dark-700  bg-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" htmlFor="">Course Description</label>
          <textarea
          type="text"
            id="price"
            value={courseInfor.description}
            onChange={(e) => setCourseInfor({ ...courseInfor, c: e.target.value })}
            className="w-full p-2 border border-[#343a46] dark:border-black rounded dark:bg-transparent dark:border-dark-700  bg-transparent"
            rows="4"
          />
        </div>

        <div className="mb-6 flex justify-between">
          <div className="w-[48%]">
            <label className="block text-sm font-medium mb-2" htmlFor="">Price</label>
            <input
              type="number"
              id="price"
              value={courseInfor.price}
              onChange={(e) => setCourseInfor({ ...courseInfor, price: e.target.value })}
              className="w-full p-2 border border-[#343a46] dark:border-black rounded dark:bg-transparent dark:border-dark-700  bg-transparent"
            />
          </div>

          <div className="w-[48%]">
            <label className="block text-sm font-medium mb-2" htmlFor="">Estimated Price (optional)</label>
            <input
              type="number"
              id="estimatedPrice"
              value={courseInfor.estimatedPrice}
              onChange={(e) => setCourseInfor({ ...courseInfor, estimatedPrice: e.target.value })}
              className="w-full p-2 border border-[#343a46] dark:border-black rounded dark:bg-transparent dark:border-dark-700  bg-transparent"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" htmlFor="">Course Tags</label>
          <input
            type="text"
            id="tags"
            value={courseInfor.tags}
            onChange={(e) => setCourseInfor({ ...courseInfor, tags: e.target.value })}
            className="w-full p-2 border border-[#343a46] dark:border-black rounded dark:bg-transparent dark:border-dark-700  bg-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" htmlFor="">Course Level</label>
          <input
            type="text"
            id="level"
            value={courseInfor.level}
            onChange={(e) => setCourseInfor({ ...courseInfor, level: e.target.value })}
            className="w-full p-2 border border-[#343a46] dark:border-black rounded dark:bg-transparent dark:border-dark-700  bg-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" htmlFor="">Demo URL</label>
          <input
            type="text"
            id="demoUrl"
            value={courseInfor.demoUrl}
            onChange={(e) => setCourseInfor({ ...courseInfor, demoUrl: e.target.value })}
            className="w-full p-2 border border-[#343a46] dark:border-black rounded dark:bg-transparent dark:border-dark-700  bg-transparent text-white"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default CourseInformation;
