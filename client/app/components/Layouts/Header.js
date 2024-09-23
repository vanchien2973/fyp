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
  Bars3Icon,
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
  const [socialAuth, { isSuccess }] = useSocialAuthMutation();
  const [logout, setLogout] = useState(false);
  const { } = useLogoutQuery(undefined, {
    skip: !logout
  });

  useEffect(() => {
    if (!user && data) {
      socialAuth({ email: data?.user?.email, name: data?.user?.name, avatar: data?.user?.image });
    }
    if (isSuccess) {
      toast.success("Login Successfully!");
    }
  }, [data, user, socialAuth, isSuccess]);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`${isFixed ? 'fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm' : ''} transition-all duration-300`}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            <Link href='/' className="text-lg sm:text-xl font-bold">ELP</Link>
            
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {navItemsData.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <Link href={item.url} legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <item.icon className="h-4 w-4 mr-2" />
                        <span className="hidden xl:inline">{item.name}</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              {user ? (
                <Link href="/profile" className="flex items-center">
                  <Image
                    src={user.avatar ? user.avatar.url : defaultAvatar}
                    width={32}
                    height={32}
                    alt="User Avatar"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-primary"
                  />
                  <span className="hidden md:inline ml-2 text-sm">{user.name}</span>
                </Link>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="text-sm">
                  <RiAccountCircleLine className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Bars3Icon className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <nav className="flex flex-col space-y-4 mt-4">
                    {navItemsData.map((item) => (
                      <Link key={item.name} href={item.url} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>

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