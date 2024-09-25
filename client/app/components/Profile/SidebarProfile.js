import React from 'react';
import Link from 'next/link';
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { IoLogOutOutline } from "react-icons/io5";
import { BookOpenIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { Separator } from '../ui/separator';

const SidebarProfile = ({ user, active, avatar, setActive, logoutHandler }) => {
  const menuItems = [
    { id: 1, label: 'My Account', icon: null, action: () => setActive(1) },
    { id: 2, label: 'Change Password', icon: ArrowPathIcon, action: () => setActive(2) },
    { id: 3, label: 'Enrolled Courses', icon: BookOpenIcon, action: () => setActive(3) },
    ...(user.role === "admin" ? [{
      id: 4,
      label: 'Admin Dashboard',
      icon: MdOutlineAdminPanelSettings,
      action: null,
      href: '/admin'
    }] : []),
    { id: 5, label: 'Logout', icon: IoLogOutOutline, action: logoutHandler },
  ];

  return (
    <div className="w-full space-y-2">
      {menuItems.map((item) => (
        <React.Fragment key={item.id}>
          {item.href ? (
            <Link href={item.href} passHref className="w-full block">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-gray-100 py-6 text-lg"
              >
                {item.id === 1 ? (
                  <Avatar className="h-8 w-8 mr-4">
                    <AvatarImage src={user.avatar || avatar ? user.avatar.url || avatar : '/assets/avatar.png'} alt="Avatar" />
                    <AvatarFallback>Avatar</AvatarFallback>
                  </Avatar>
                ) : item.icon && <item.icon className="mr-4 h-7 w-7" />}
                <span className="hidden md:inline">{item.label}</span>
              </Button>
            </Link>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-gray-100 py-6 text-lg"
              onClick={item.action}
            >
              {item.id === 1 ? (
                <Avatar className="h-8 w-8 mr-4">
                  <AvatarImage src={user.avatar || avatar ? user.avatar.url || avatar : '/assets/avatar.png'} alt="Avatar" />
                  <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>
              ) : item.icon && <item.icon className="mr-4 h-7 w-7" />}
              <span className="hidden md:inline">{item.label}</span>
            </Button>
          )}
          {item.id === 1 && <Separator/>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SidebarProfile;