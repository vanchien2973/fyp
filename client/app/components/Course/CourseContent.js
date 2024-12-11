import { useGetCourseContentQuery } from "@/app/redux/features/courses/coursesApi";
import React, { useState, useEffect } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Layouts/Header";
import CourseContentMedia from "./CourseContentMedia";
import CourseContentList from "./CourseContentList";

const CourseContent = ({ id, user }) => {
  const { data: contentData, isLoading, refetch } = useGetCourseContentQuery(id, { refetchOnMountOrArgChange: true });
  const [activeVideo, setActiveVideo] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const data = contentData?.contents?.[activeSection]?.content;
  const [route, setRoute] = useState('Login');
  const [open, setOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.getElementById('course-header');
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  const isAdmin = user?.role === 'admin';
  const adminMessage = isAdmin ? (
    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
      You are watching this course as an admin.
    </div>
  ) : null;

  return (
    <div className="flex flex-col min-h-screen">
      <div id="course-header" className="fixed top-0 left-0 right-0 z-50 shadow-md">
        <Header
          route={route}
          setRoute={setRoute}
          open={open}
          setOpen={setOpen}
          activeItem={1}
        />
      </div>
      <div className="flex-grow" style={{ paddingTop: `${headerHeight}px` }}>
        <div className="container mx-auto p-4">
          {adminMessage}
          <Heading
            title={`${data?.[activeVideo]?.title || 'Course'} - ELP`}
            description="ELP is an English center."
            keywords={data?.[activeVideo]?.tags}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <Loader />
            ) : (
              <>
                {data && (
                  <>
                    <div className="lg:col-span-2">
                      <CourseContentMedia
                        data={data}
                        id={id}
                        activeVideo={activeVideo}
                        setActiveVideo={setActiveVideo}
                        user={user}
                        refetch={refetch}
                      />
                    </div>
                    <div className="lg:col-span-1 ml-3 mr-3">
                      <CourseContentList
                        data={contentData?.contents}
                        activeVideo={activeVideo}
                        setActiveVideo={setActiveVideo}
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;