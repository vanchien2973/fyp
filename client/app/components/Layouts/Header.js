'use client';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import defaultAvatar from "../../../public/assets/avatar.png";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import CustomModal from "../../utils/CustomModal";
import Login from "../Auth/Login";
import SignUp from "../Auth/SignUp";
import Verification from "../Auth/Verification";
import { useLogoutQuery, useSocialAuthMutation } from "../../redux/features/auth/authApi";
import { usePathname } from 'next/navigation';

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
import { useLoadUserQuery } from "@/app/redux/features/api/apiSlice";
import DropdownNotifications from "../Admin/dashboard/DropdownNotification";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navItemsData = [
  { name: "Home", url: "/", icon: HomeIcon },
  { name: "Courses", url: "/courses", icon: AcademicCapIcon },
  { name: "Forum", url: "/forum", icon: ChatBubbleLeftRightIcon },
  { name: "About Us", url: "/aboutus", icon: UserGroupIcon },
  { name: "FAQ", url: "/faq", icon: QuestionMarkCircleIcon },
];

const Header = ({ open, setOpen, route, setRoute }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { data } = useSession();
  const [socialAuth, { isSuccess }] = useSocialAuthMutation();
  const [logout, setLogout] = useState(false);
  const { data: userData, isLoading, refetch } = useLoadUserQuery(undefined, {});
  const { } = useLogoutQuery(undefined, { skip: !logout ? true : false });
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!userData) {
        if (data) {
          socialAuth({
            email: data?.user?.email,
            name: data?.user?.name,
            avatar: data?.user?.image,
          });
          refetch();
        }
      }
      if (data === null) {
        if (isSuccess) {
          toast.success("Login Successfully");
        }
      }
      if (data === null && !isLoading && !userData) {
        setLogout(true);
      }
    }
  }, [data, userData, isLoading]);


  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm' : ''
        }`}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            <Link href='/' className="text-lg sm:text-xl font-bold">ELP</Link>

            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {navItemsData.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <Link href={item.url} legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <item.icon className={`h-4 w-4 mr-2 ${pathname === item.url ? 'text-primary' : ''}`} />
                        <span className={`hidden xl:inline ${pathname === item.url ? 'text-primary font-semibold' : ''}`}>{item.name}</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {userData ? (
                <>
                  <DropdownNotifications />
                  <ThemeToggle />
                  <Link href="/profile" className="flex items-center">
                    <Avatar className="w-[40px] h-[40px]">
                      <AvatarImage src={user.avatar || userData?.avatar ? user.avatar?.url : defaultAvatar} alt="Profile" />
                      <AvatarFallback>
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </>
              ) : (
                <>
                  <ThemeToggle />
                  <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="text-sm">
                    <RiAccountCircleLine className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                </>
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
                      <Link key={item.name} href={item.url} className={`flex items-center space-x-2 p-2 rounded-md hover:bg-accent ${pathname === item.url ? 'bg-accent text-primary font-semibold' : ''}`}>
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
          component={Login}
          refetch={refetch}
        />
      )}
      {route === "SignUp" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          component={SignUp}
        />
      )}
      {route === "Verification" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          component={Verification}
        />
      )}
    </>
  );
};

export default Header;