import { useGetCourseContentQuery } from "@/app/redux/features/courses/coursesApi";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Layouts/Header";
import CourseContentMedia from "./CourseContentMedia";
import CourseContentList from "./CourseContentList";

const CourseContent = ({ id, user }) => {
  const { data: contentData, isLoading, refetch } = useGetCourseContentQuery(id, { refetchOnMountOrArgChange: true });
  const [activeVideo, setActiveVideo] = useState(0);
  const data = contentData?.contents?.[0]?.content;
  const [route, setRoute] = useState('Login');
  const [open, setOpen] = useState(false);

  return (
    <>
      <Header
        route={route}
        setRoute={setRoute}
        open={open}
        setOpen={setOpen}
        activeItem={1}
      />
      <div className="container mx-auto p-4 min-h-screen">
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
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseContent;
