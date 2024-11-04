'use client'
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";
import ChooseTestEntry from "../components/EntryTest/ChooseTestEntry";
import { useSelector } from "react-redux";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState('Login');

  return (
    <>
      <Heading
        title='Entry Test - ELP'
        description="Take our entry test to find your perfect course"
        keywords="Entry test, placement test, English level"
      />
      <Header
        open={open}
        setOpen={setOpen}
        setRoute={setRoute}
        route={route}
      />
      <ChooseTestEntry />
      <Footer />
    </>
  );
};

export default Page;
