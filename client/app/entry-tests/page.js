'use client'
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";
import Heading from "../utils/Heading";
import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";
import ChooseTestEntry from "../components/EntryTest/ChooseTestEntry";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState('Login');
  const { user } = useSelector((state) => state.auth);

  if (!user) {
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
        <div className="max-w-6xl mx-auto p-4 min-h-[calc(100vh-200px)] flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Login Required</h2>
              <p className="text-muted-foreground mb-6">
                Please log in to access the resources
              </p>
              <Button 
                onClick={() => {
                  setOpen(true);
                  setRoute("Login");
                }}
                className="w-full"
              >
                Login to Continue
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  // Hiển thị danh sách bài test nếu đã đăng nhập
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
