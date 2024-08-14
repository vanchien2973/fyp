'use client'
import React, { useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Hero";
import OutImpressiveStats from "./components/OutImpressiveStats";
import Footer from "./components/Footer";


const Page = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
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
      <OutImpressiveStats />
      <div className="h-[900px]"></div>
      <Footer />
    </>
  )
};

export default Page;