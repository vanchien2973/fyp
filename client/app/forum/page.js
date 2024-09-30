'use client'
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";
import Forum from "../components/Layouts/Forums/Forum";
import { useSelector } from "react-redux";

const page = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState('Login');
  const { user } = useSelector((state) => state.auth);
  return (
    <>
        <Heading
          title='FAQ - ELP'
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
        <Forum user={user}/>
        <Footer />
    </>
  );
};

export default page;
