'use client'
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";
import PageContainer from "../components/ui/page-container";
import AllCourses from "../components/Course/AllCourses";

const page = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(1);
  const [route, setRoute] = useState('Login');
  return (
    <>
        <Heading
          title='Courses - ELP'
          description="LMS using MERN"
          keywords="MERN, Redux, Redis"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <AllCourses />
        <Footer />
    </>
  );
};

export default page;
