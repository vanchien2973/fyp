'use client';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import defaultAvatar from "../../../public/assets/avatar.png";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import CustomModal from "../../utils/CustomModal";
import Login from "../Auth/Login";
import SignUp from "../Auth/SignUp";
import Verification from "../Auth/Verification";
import { useLogoutQuery, useSocialAuthMutation } from "../../redux/features/auth/authApi";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

import {
  HomeIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";
import { RiAccountCircleLine } from "react-icons/ri";
import ThemeToggle from "../Admin/layouts/ThemeToggle";

const navItemsData = [
  { name: "Home", url: "/", icon: HomeIcon },
  { name: "Courses", url: "/courses", icon: AcademicCapIcon },
  { name: "Forum", url: "/forum", icon: ChatBubbleLeftRightIcon },
  { name: "About Us", url: "/aboutus", icon: UserGroupIcon },
  { name: "FAQ", url: "/faq", icon: QuestionMarkCircleIcon },
];

const Header = ({ open, setOpen, activeItem, route, setRoute }) => {
  const [isFixed, setIsFixed] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { data } = useSession();
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
  const [logout, setLogout] = useState(false);
  const { } = useLogoutQuery(undefined, {
    skip: !logout ? true : false
  });

  useEffect(() => {
    if (!user && data) {
      socialAuth({ email: data?.user?.email, name: data?.user?.name, avatar: data?.user?.image });
    }
    if (isSuccess) {
      toast.success("Login Succesffully!");
    }
    // if (data === null) {
    //   setLogout(true);
    // }
  }, [data, user]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 85) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className={`${isFixed ? 'fixed top-0 left-0 right-0 z-50' : ''} px-10`}>
        <div className="mx-auto container">
          <nav className={`mt-6 rounded-lg border-0 pr-3 py-3 pl-6 flex items-center justify-between ${isFixed ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md' : ''}`}>
            <Link href='/' className="text-lg font-bold">ELP</Link>
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {navItemsData.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <Link href={item.url} legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <item.icon className="h-5 w-5 mr-2" />
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <Link href="/profile">
                  <Image
                    src={user.avatar ? user.avatar.url : defaultAvatar}
                    width={40}
                    height={40}
                    alt=""
                    className="w-[30px] h-[30px] rounded-full border-2 border-primary"
                  />
                </Link>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
                  <RiAccountCircleLine size={25} />
                </Button>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4 mt-4">
                    {navItemsData.map((item) => (
                      <Link key={item.name} href={item.url} className="flex items-center space-x-2">
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </div>

      {route === "Login" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Login}
        />
      )}
      {route === "SignUp" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={SignUp}
        />
      )}
      {route === "Verification" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Verification}
        />
      )}
    </>
  );
};

export default Header;
