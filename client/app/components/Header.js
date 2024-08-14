'use client';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
    Navbar as MTNavbar,
    Collapse,
    Typography,
    IconButton,
} from "@material-tailwind/react";
import {
    HomeIcon,
    AcademicCapIcon,
    ChatBubbleLeftRightIcon,
    UserGroupIcon,
    QuestionMarkCircleIcon,
    XMarkIcon,
    Bars3Icon,
} from "@heroicons/react/24/solid";
import { RiAccountCircleLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import Image from "next/image";
import defaultAvatar from "../../public/assets/avatar.png";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import CustomModal from "../utils/CustomModal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
import { useLogoutQuery, useSocialAuthMutation } from "../redux/features/auth/authApi";

const navItemsData = [
    { name: "Home", url: "/", icon: HomeIcon },
    { name: "Courses", url: "/courses", icon: AcademicCapIcon },
    { name: "Forum", url: "/forum", icon: ChatBubbleLeftRightIcon },
    { name: "About Us", url: "/aboutus", icon: UserGroupIcon },
    { name: "FAQ", url: "/faq", icon: QuestionMarkCircleIcon },
];

const Header = ({ open, setOpen, activeItem, route, setRoute }) => {
    const [isFixed, setIsFixed] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
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
        // if (isSuccess) {
        //     toast.success("Login Succesffully!");
        // }
        // if (data === null) {
        //     setLogout(true);
        // }
    }, [data, user]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 960) setOpenSidebar(false);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

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

    function handleOpen() {
        setOpenSidebar((cur) => !cur);
    }
    return (
        <>
            <div className={`${isFixed ? 'fixed top-0 left-0 right-0 z-50' : ''} px-10`}>
                <div className="mx-auto container">
                    <MTNavbar
                        blurred
                        color="white"
                        className={`z-50 mt-6 relative border-0 pr-3 py-3 pl-6 ${isFixed ? 'shadow-md' : ''}`}
                    >
                        <div className="flex items-center justify-between">
                            <Typography className="text-lg font-bold">
                                <Link href='/' className="text-black">ELP</Link>
                            </Typography>
                            <ul className="ml-10 hidden items-center gap-8 lg:flex">
                                {navItemsData.map((item, index) => (
                                    <li key={item.name}>
                                        <Link href={item.url} passHref className="flex items-center gap-2">
                                            <item.icon className="h-5 w-5 cursor-pointer text-black" />
                                            <span
                                                className={`${activeItem === index
                                                    ? "text-[crimson]"
                                                    : "text-black"
                                                    }`}
                                            >
                                                {item.name}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="hidden items-center gap-4 lg:flex z-50">
                                {user ? (
                                    <Link href="/profile">
                                        <Image
                                            src={user.avatar ? user.avatar.url : defaultAvatar}
                                            width={30}
                                            height={30}
                                            alt=""
                                            className="w-[30px] h-[30px] rounded-full ml-3 border-[2px] border-[#181e1d]"
                                        />
                                    </Link>
                                ) : (
                                    <RiAccountCircleLine
                                        size={25}
                                        className="hidden 800px:block cursor-pointer text-black"
                                        onClick={() => setOpen(true)}
                                    />
                                )}
                            </div>
                            <IconButton
                                variant="text"
                                onClick={handleOpen}
                                className="ml-auto inline-block lg:hidden"
                            >
                                {openSidebar ? (
                                    <XMarkIcon strokeWidth={2} className="h-6 w-6" />
                                ) : (
                                    <Bars3Icon strokeWidth={2} className="h-6 w-6" />
                                )}
                            </IconButton>
                        </div>
                        <Collapse open={openSidebar}>
                            <div className="container mx-auto mt-3 border-t border-[#232730] px-2 pt-4">
                                <ul className="flex flex-col gap-4">
                                    {navItemsData.map((item, index) => (
                                        <li key={item.name}>
                                            <Link href={item.url} passHref className="flex items-center gap-2">
                                                <item.icon className="h-5 w-5 cursor-pointer text-black" />
                                                <span
                                                    className={`${activeItem === index
                                                        ? "text-[crimson]"
                                                        : "text-black"
                                                        }`}
                                                >
                                                    {item.name}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 mb-4 flex items-center gap-4">
                                    {user ? (
                                        <Link href="/profile">
                                            <Image
                                                src={user.avatar ? user.avatar.url : defaultAvatar}
                                                width={30}
                                                height={30}
                                                alt=""
                                                className="w-[30px] h-[30px] rounded-full ml-3 border-[1px] border-[#181e1d]" />
                                        </Link>
                                    ) : (
                                        <RiAccountCircleLine
                                            size={25}
                                            className="cursor-pointer text-black"
                                            onClick={() => setOpen(true)}
                                        />
                                    )}
                                </div>
                                <p className="text-[16px] px-2 pl-5 text-center text-black">Copyright © 2024 ELP</p>
                            </div>
                        </Collapse>
                    </MTNavbar>
                </div>
            </div>
            {
                route === "Login" && (
                    <>
                        {
                            open && (
                                <CustomModal
                                    open={open}
                                    setOpen={setOpen}
                                    setRoute={setRoute}
                                    activeItem={activeItem}
                                    component={Login}
                                />
                            )
                        }
                    </>
                )
            }
            {
                route === "SignUp" && (
                    <>
                        {
                            open && (
                                <CustomModal
                                    open={open}
                                    setOpen={setOpen}
                                    setRoute={setRoute}
                                    activeItem={activeItem}
                                    component={SignUp}
                                />
                            )
                        }
                    </>
                )
            }
            {
                route === "Verification" && (
                    <>
                        {
                            open && (
                                <CustomModal
                                    open={open}
                                    setOpen={setOpen}
                                    setRoute={setRoute}
                                    activeItem={activeItem}
                                    component={Verification}
                                />
                            )
                        }
                    </>
                )
            }
        </>
    )
}

export default Header;
