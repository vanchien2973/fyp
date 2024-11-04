'use client'
import React, { useState } from "react";
import Heading from "@/app/utils/Heading";
import Footer from "@/app/components/Layouts/Footer";
import RecommendationCourse from "@/app/components/EntryTest/RecommendationCourse";
import Header from "@/app/components/Layouts/Header";

const Page = () => {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState('Login');

  return (
    <>
        <Heading
          title='Recommendation Courses - ELP'
          description="LMS using MERN"
          keywords="MERN, Redux, Redis"
        />
        <Header
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          route={route}
        />
        <RecommendationCourse/>
        <Footer />
    </>
  );
};

export default Page;
