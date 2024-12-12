import React from 'react';
import Link from 'next/link';
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback, UserAvatar } from "../ui/avatar";
import { IoLogOutOutline } from "react-icons/io5";
import { BookOpenIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import defaultAvatar from "../../../public/assets/avatar.png";

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

  const renderButton = (item) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={active === item.id ? "secondary" : "ghost"}
            className="w-full justify-start hover:bg-gray-100 py-4 md:py-6 text-base mt-2"
            onClick={item.action}
          >
            {item.id === 1 ? (
              <Avatar className="w-[40px] h-[40px]">
                <AvatarImage src={user.avatar || avatar ? user.avatar.url : defaultAvatar} alt="Profile" />
                <AvatarFallback>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            ) : item.icon && <item.icon className="h-5 w-5 md:h-7 md:w-7" />}
            <span className="hidden md:inline ml-3">{item.label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="w-full space-y-1 md:space-y-2">
      {menuItems.map((item) => (
        <React.Fragment key={item.id}>
          {item.href ? (
            <Link href={item.href} passHref className="w-full block">
              {renderButton(item)}
            </Link>
          ) : (
            renderButton(item)
          )}
          {item.id === 1 && <Separator className="my-2" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SidebarProfile;