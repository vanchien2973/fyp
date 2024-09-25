import React, { useEffect, useState } from "react";
import avatarIcon from "@/public/assets/avatar.png";
import { useLoadUserQuery } from "@/app/redux/features/api/apiSlice";
import { useEditProfileMutation, useUpdateAvatarMutation } from "@/app/redux/features/user/userApi";
import toast from "react-hot-toast";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { CameraIcon } from "lucide-react";

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
                updateAvatar({ avatar });
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
            });
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                        <Avatar className="w-[120px] h-[120px]">
                            <AvatarImage src={user.avatar || avatar ? user.avatar.url || avatar : avatarIcon} alt="Profile" />
                            <AvatarFallback>
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <input
                            type="file"
                            id="avatar"
                            className="hidden"
                            onChange={imageHandler}
                            accept="image/png, image/jpg, image/jpeg, image/webp"
                        />
                        <label htmlFor="avatar" className="absolute bottom-1 right-1 cursor-pointer">
                            <div className="w-[30px] h-[30px] bg-secondary rounded-full flex items-center justify-center">
                                <CameraIcon className="h-5 w-5" />
                            </div>
                        </label>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="text"
                                readOnly
                                value={user?.email}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-center mt-6">
                            <Button className="w-full sm:w-[400px]" type="submit">
                                Update
                            </Button>
                        </div>
                    </form>
                </div>
            </CardContent>
        </div>
    );
};

export default ProfileInfor;