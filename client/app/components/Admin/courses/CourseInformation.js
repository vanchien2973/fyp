'use client';
import React, { useState } from 'react';

const CourseInformation = ({ courseInfor, setCourseInfor, active, setActive }) => {
  const [dragging, setDragging] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (reader.readyState === 2) {
          setCourseInfor({ ...courseInfor, thumbnail: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  }

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  }

  const handleDragDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.file[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCourseInfor({ ...courseInfor, thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="w-[80%] m-auto mt-24">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" htmlFor="name">Course Name</label>
          <input
            type="text"
            id="name"
            required
            value={courseInfor.name}
            onChange={(e) => setCourseInfor({ ...courseInfor, name: e.target.value })}
            className="w-full p-2 border border-[#343a46] dark:border-black rounded dark:bg-transparent dark:border-dark-700  bg-transparent"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" htmlFor="description">Course Description</label>
          <textarea
            rows={8}
            cols={30}
            type="text"
            id="description"
            value={courseInfor.description}
            onChange={(e) => setCourseInfor({ ...courseInfor, description: e.target.value })}
            className="w-full p-2 border border-[#343a46] dark:border-black rounded dark:bg-transparent dark:border-dark-700  bg-transparent"
          />
        </div>
        <div className="mb-6 flex justify-between">
          <div className="w-[48%]">
            <label className="block text-sm font-medium mb-2" htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              required
              value={courseInfor.price}
              onChange={(e) => setCourseInfor({ ...courseInfor, price: e.target.value })}
              className="w-full p-2 border border-[#343a46] dark:border-black rounded dark:bg-transparent dark:border-dark-700  bg-transparent"
            />
          </div>
          <div className="w-[48%]">
            <label className="block text-sm font-medium mb-2" htmlFor="estimatedPrice">Estimated Price (optional)</label>
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
          <label className="block text-sm font-medium mb-2" htmlFor="tags">Course Tags</label>
          <input
            type="text"
            id="tags"
            value={courseInfor.tags}
            onChange={(e) => setCourseInfor({ ...courseInfor, tags: e.target.value })}
            className="w-full p-2 border border-[#343a46] dark:border-black rounded dark:bg-transparent dark:border-dark-700  bg-transparent"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" htmlFor="level">Course Level</label>
          <input
            type="text"
            id="level"
            required
            value={courseInfor.level}
            onChange={(e) => setCourseInfor({ ...courseInfor, level: e.target.value })}
            className="w-full p-2 border border-[#343a46] dark:border-black rounded dark:bg-transparent dark:border-dark-700  bg-transparent"
          />
        </div>
        <div className="mb-6">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleChangeFile}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[10vh] p-3 flex items-center justify-center border border-[#343a46] dark:border-black rounded dark:border-dark-700 ${dragging ? "bg-blue-500" : "bg-transparent"
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDragDrop}
          >
            {courseInfor.thumbnail ? (
              <img
                src={courseInfor.thumbnail}
                alt=""
                className="max-h-full w-full object-cover"
              />
            ) : (
              <span>
                Drag and drop your thumbnail here or click to browse
              </span>
            )}
          </label>
        </div>
        <div className='mb-6'>
          <div className='flex items-center justify-end'>
            <input
              type="submit"
              value="Next"
              className="px-4 py-2 bg-[#58c4dc] rounded text-center mt-4 cursor-pointer dark:bg-[#58c4dc]"
            />
          </div>
        </div>
      </form>
    </div>
  )
};

export default CourseInformation;
