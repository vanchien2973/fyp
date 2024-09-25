import React, { useEffect, useState } from 'react'
import SidebarProfile from './SidebarProfile';
import { signOut } from 'next-auth/react';
import { useLogoutQuery } from '@/app/redux/features/auth/authApi';
import ProfileInfor from './ProfileInfor';
import ChangePassword from './ChangePassword';
import { Card } from "../ui/card"

const Profile = ({ user }) => {
    const [scroll, setScroll] = useState(false);
    const [avatar, setAvatar] = useState(null)
    const [active, setActive] = useState(1);
    const [logout, setLogout] = useState(false);
    const {} = useLogoutQuery(undefined, {
        skip: !logout ? true : false
    });

    const logoutHandler = async () => {
        setLogout(true);
        await signOut();
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 85) {
                setScroll(true);
            } else {
                setScroll(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    
    return (
        <div className="pt-[80px] pb-[80px] w-[85%] flex mx-auto">
            <Card
                className={`w-[60px] 800px:w-[310px] h-[450px] mt-[6px] sticky ${
                    scroll ? "top-[180px]" : "top-[30px]"
                } left-[30px]`}
            >
                <SidebarProfile
                    user={user}
                    active={active}
                    avatar={avatar}
                    setActive={setActive}
                    logoutHandler={logoutHandler}
                />
            </Card>
            {active === 1 && (
                <div className="w-full h-[80%] bg-transparent">
                    <ProfileInfor avatar={avatar} user={user} />
                </div>
            )}
            {active === 2 && (
                <div className="w-full h-[80%] bg-transparent">
                    <ChangePassword />
                </div>
            )}
        </div>
    )
}

export default Profile;