import React from 'react';
import avatarDefault from "../../../public/assets/avatar.png"
import Image from 'next/image';
import { IoLogOutOutline } from "react-icons/io5";
import { BookOpenIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Link from 'next/link';



const SidebarProfile = ({ user, active, avatar, setActive, logoutHandler }) => {
    return (
        <div className='w-full'>
            <div className={`w-full flex items-center px-3 py-4 cursor-pointer bg-transparent
                }`}
                onClick={() => setActive(1)}>
                <Image
                    src={user.avatar || avatar ? user.avatar.url || avatar : avatarDefault}
                    width={20}
                    height={20}
                    alt=''
                    className='w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full border-[1px]'
                />
                <h5 className='pl-2 800px:block hidden font-Roboto text-black'>My Account</h5>
            </div>
            <hr></hr>
            <div className={`w-full flex items-center px-3 py-4 cursor-pointer bg-transparent
                }`}
                onClick={() => setActive(2)}>
                <ArrowPathIcon className="h-6 w-6 text-black" />
                <h5 className='pl-2 800px:block hidden font-Roboto text-black'>Change Password</h5>
            </div>
            <div className={`w-full flex items-center px-3 py-4 cursor-pointer bg-transparent
                }`}
                onClick={() => setActive(3)}>
                <BookOpenIcon className="h-6 w-6 text-black" />
                <h5 className='pl-2 800px:block hidden font-Roboto text-black'>Enrolled Courses</h5>
            </div>
            {
                user.role === "admin" && (
                    <Link className={`w-full flex items-center px-3 py-4 cursor-pointer bg-transparent
                }`}
                        href={"/admin"}>
                        <MdOutlineAdminPanelSettings className="h-6 w-6 text-black" />
                        <h5 className='pl-2 800px:block hidden font-Roboto text-black'>Admin Dashboard</h5>
                    </Link>
                )
            }
            <div className={`w-full flex items-center px-3 py-4 cursor-pointer bg-transparent
                }`}
                onClick={() => logoutHandler()}>
                <IoLogOutOutline size={25} className='text-black' />
                <h5 className='pl-2 800px:block hidden font-Roboto text-black'>Logout</h5>
            </div>
        </div>
    )
}


export default SidebarProfile;

