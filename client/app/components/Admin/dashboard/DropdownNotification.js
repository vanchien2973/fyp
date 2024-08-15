'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Transition from '@/app/utils/Transition';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';

const DropdownNotifications = ({ align }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const trigger = useRef(null);
    const dropdown = useRef(null);

    // Close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
            setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, [dropdownOpen]);

    // Close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    }, [dropdownOpen]);

    return (
        <div className="relative inline-flex">
            <button
                ref={trigger}
                className={`w-8 h-8 flex items-center justify-center rounded-full ${dropdownOpen && 'bg-gray-200 dark:bg-gray-800'}`}
                aria-haspopup="true"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
            >
                <span className="sr-only">Notifications</span>
                <NotificationsActiveOutlinedIcon />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-gray-100 dark:border-gray-900 rounded-full"></div>
            </button>

            <Transition
                className={`origin-top-right z-10 absolute top-full -mr-48 sm:mr-0 min-w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
                show={dropdownOpen}
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            >
                <div
                    ref={dropdown}
                    onFocus={() => setDropdownOpen(true)}
                    onBlur={() => setDropdownOpen(false)}
                >
                    <div className="text-xs font-semibold text-black dark:text-white uppercase pt-1.5 pb-2 px-4">Notifications</div>
                    <ul>
                        <li className="border-b border-gray-200 dark:border-gray-700/60 last:border-0">
                            <Link href="#0" className="block py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/20" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-medium text-green-600 dark:text-green-400">New Question Received</span>
                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 cursor-pointer">Mark as read</span>
                                </div>
                                <span className="block text-sm mb-2 font-medium text-black dark:text-white">
                                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type.
                                </span>
                                <span className="block text-xs font-medium text-black dark:text-white">Feb 12, 2024</span>
                            </Link>
                        </li>
                        <li className="border-b border-gray-200 dark:border-gray-700/60 last:border-0">
                            <Link href="#0" className="block py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/20" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-medium text-green-600 dark:text-green-400">New Question Received</span>
                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 cursor-pointer">Mark as read</span>
                                </div>
                                <span className="block text-sm mb-2 font-medium text-black dark:text-white">
                                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type.
                                </span>
                                <span className="block text-xs font-medium text-black dark:text-white">Feb 12, 2024</span>
                            </Link>
                        </li>
                        <li className="border-b border-gray-200 dark:border-gray-700/60 last:border-0">
                            <Link href="#0" className="block py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/20" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-medium text-green-600 dark:text-green-400">New Question Received</span>
                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 cursor-pointer">Mark as read</span>
                                </div>
                                <span className="block text-sm mb-2 font-medium text-black dark:text-white">
                                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type.
                                </span>
                                <span className="block text-xs font-medium text-black dark:text-white">Feb 12, 2024</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </Transition>
        </div>
    );
};

export default DropdownNotifications;
