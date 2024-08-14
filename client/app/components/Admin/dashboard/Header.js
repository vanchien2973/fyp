'use client'
import React, { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";

const Header = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full flex items-center justify-end p-6 fixed top-0 right-0">
            <div
                className="relative cursor-pointer m-2"
                onClick={() => setOpen(!open)}
            >
                <IoMdNotificationsOutline className="text-2xl cursor-pointer" />
                <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
                    3
                </span>
            </div>
            {open && (
                <div className="w-[350px] h-[50vh] shadow-xl absolute top-16 z-10 rounded bg-white">
                    <h5 className="text-center text-[20px] font-Poppins p-3">
                        Notifications
                    </h5>
                    <div className="bg-[#00000013] border-b border-b-[#0000000f]">
                        <div className="w-full flex items-center justify-between p-2">
                            <p>
                                New Question Received
                            </p>
                            <p>
                                Mark as read
                            </p>
                        </div>
                        <p className="px-2">
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                            when an unknown printer took a galley of type and scrambled it to make a type.
                        </p>
                        <p className="p-2">
                            5 days ago
                        </p>
                    </div>
                    <div className="bg-[#00000013] border-b border-b-[#0000000f]">
                        <div className="w-full flex items-center justify-between p-2">
                            <p>
                                New Question Received
                            </p>
                            <p>
                                Mark as read
                            </p>
                        </div>
                        <p className="px-2">
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                            when an unknown printer took a galley of type and scrambled it to make a type.
                        </p>
                        <p className="p-2">
                            5 days ago
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;
