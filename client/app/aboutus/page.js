'use client'
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";
import About from "../components/Layouts/About";

const page = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(4);
  const [route, setRoute] = useState('Login');
  return (
    <>
        <Heading
          title='About - ELP'
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
        <About />
        <Footer />
    </>
  );
};

export default page;
