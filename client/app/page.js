'use client'
import React, { useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Layouts/Header";
import Footer from "./components/Layouts/Footer";
import Courses from "./components/Layouts/Courses";
import Reviews from "./components/Layouts/Reviews";
import FAQ from "./components/Layouts/FAQ";
import Hero from "./components/Layouts/Hero";


const Page = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(1);
  const [route, setRoute] = useState('Login');

  return (
    <>
      <Heading
        title="ELP - Learning Path Mastery"
        description="Learning Path Mastery"
        keywords="ELP, Learn, English"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <Hero />
      <Courses />
      <Reviews />
      <FAQ />
      <Footer />
    </>
  )
};

export default Page;