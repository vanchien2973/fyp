import React, { useState } from 'react'
import { signOut } from 'next-auth/react';
import { useLogoutQuery } from '@/app/redux/features/auth/authApi';
import { Card } from "../ui/card"
import SidebarProfile from './SidebarProfile';
import ProfileInfor from './ProfileInfor';
import ChangePassword from './ChangePassword';
import EnrolledCourse from './EnrolledCourse';

const Profile = ({ user }) => {
    const [avatar, setAvatar] = useState(null)
    const [active, setActive] = useState(1);
    const [logout, setLogout] = useState(false);
    const {} = useLogoutQuery(undefined, {
        skip: !logout
    });

    const logoutHandler = async () => {
        setLogout(true);
        await signOut();
    };

    const renderContent = () => {
        switch(active) {
            case 1:
                return <ProfileInfor avatar={avatar} user={user} />;
            case 2:
                return <ChangePassword />;
            case 3:
                return <EnrolledCourse user={user}/>;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto py-6 px-4 md:py-10 md:px-0">
            <div className="flex flex-col md:flex-row gap-6">
                <Card className="w-full md:w-64 shrink-0">
                    <SidebarProfile
                        user={user}
                        active={active}
                        avatar={avatar}
                        setActive={setActive}
                        logoutHandler={logoutHandler}
                    />
                </Card>
                <div className="flex-1 p-4 md:p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}

export default Profile;