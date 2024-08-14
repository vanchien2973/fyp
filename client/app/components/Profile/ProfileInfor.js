import Image from "next/image";
import React, { useEffect, useState } from "react";
import avatarIcon from "@/public/assets/avatar.png";
import { IoCameraReverse } from "react-icons/io5";
import { useLoadUserQuery } from "@/app/redux/features/api/apiSlice";
import {
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { CameraIcon } from "@heroicons/react/24/outline";

import { useEditProfileMutation, useUpdateAvatarMutation } from "@/app/redux/features/user/userApi";
import toast from "react-hot-toast";

const ProfileInfor = ({ avatar = null, user }) => {
    const [name, setName] = useState(user && user.name);
    const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
    const [updateAvatar, {isSuccess, error}] = useUpdateAvatarMutation();
    const [editProfile, {isSuccess: success, error: editError}] = useEditProfileMutation();
    const [loadUser, setLoadUser] = useState(false);
    const {} = useLoadUserQuery(undefined, {skip : loadUser ? false : true});

    const imageHandler = async (e) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            if (fileReader.readyState === 2) {
                const avatar = fileReader.result;
                updateAvatar({
                    avatar,
                })
            }
        };
        fileReader.readAsDataURL(e.target.files[0]);
    };

    useEffect(() => {
        if (isSuccess || success) {
            setLoadUser(true);
            toast.success("Profile updated successfully!")
        }
        if(error || editError) {
            console.log(error)
        }
    }, [isSuccess, error, success, editError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(name !== "") {
             await editProfile({
                name: name,
                phoneNumber: phoneNumber
            })
        }
    };

    return (
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                        <Image
                            src={user.avatar || avatar ? user.avatar.url || avatar : avatarIcon}
                            alt=""
                            width={90}
                            height={90}
                            className="w-[120px] h-[120px] cursor-pointer border-[2px] border-[#181e1d] rounded-full"
                        />
                        <input
                            type="file"
                            name=""
                            id="avatar"
                            className="hidden"
                            onChange={imageHandler}
                            accept="image/png, image/jpg, image/jpeg, image/webp"
                        />
                        <label htmlFor="avatar">
                            <div className="w-[30px] h-[30px] bg-slate-400 rounded-full absolute bottom-1 right-1 flex items-center justify-center cursor-pointer">
                                <CameraIcon className="h-8 w-8 text-black" />
                            </div>
                        </label>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="flex flex-col gap-6">
                            <div>
                                <Typography variant="h6" color="blue-gray" className="mb-2">
                                    Full Name
                                </Typography>
                                <Input
                                    type="text"
                                    size="lg"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                    labelProps={{
                                        className: "before:content-none after:content-none",
                                    }}
                                />
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray" className="mb-2">
                                    Email
                                </Typography>
                                <Input
                                    type="text"
                                    size="lg"
                                    readOnly
                                    value={user?.email}
                                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                    labelProps={{
                                        className: "before:content-none after:content-none",
                                    }}
                                />
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray" className="mb-2">
                                    Phone Number
                                </Typography>
                                <Input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    size="lg"
                                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                    labelProps={{
                                        className: "before:content-none after:content-none",
                                    }}
                                />
                            </div>
                            <div className="flex justify-center mt-6">
                                <Button className="w-full sm:w-[400px]" type="submit">
                                    Update
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfor;