import { useGetCourseContentQuery } from "@/app/redux/features/courses/coursesApi";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import CourseContentMedia from "./CourseContentMedia";

const CourseContent = ({ id }) => {
  const { data: contentData, isLoading } = useGetCourseContentQuery(id);
  const [videoActive, setVideoActive] = useState(0); 
  const data = contentData?.contents?.[0]?.content;
  const [route, setRoute] = useState('Login');
  const [open, setOpen] = useState(false);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {data && (
            <>
              <Heading
                title={data[videoActive]?.title + " - ELP"}
                description={"ELP is an English center."}
                keywords={data[videoActive]?.tags}
              />
              <Header
                route={route}
                setRoute={setRoute}
                open={open}
                setOpen={setOpen}
                activeItem={1}
              />
              <CourseContentMedia
                data={data}
                id={id}
                videoActive={videoActive}
                setVideoActive={setVideoActive}
               />
              <Footer />
            </>
          )}
        </>
      )}
    </>
  );
};

export default CourseContent;
