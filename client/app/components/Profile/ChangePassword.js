'use client'
import { useUpdatePasswordMutation } from '@/app/redux/features/user/userApi';
import { Button, Typography, Input } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

    const passwordChangeHandler = async (e) => {
        e.preventDefault();
    
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
    
        if (currentPassword === newPassword) {
            toast.error("New password cannot be the same as the current password");
            return;
        }
    
        await updatePassword({ currentPassword, newPassword });
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Password changed successfully")
        }
        if (error) {
            if ("data" in error) {
                const errorData = error;
                toast.error(errorData.error.message);
            }
        }
    }, [isSuccess, error])

    return (
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-8">
            <div className="max-w-3xl mx-auto">
                <Typography variant="h4" color="blue-gray" className="text-center mb-6">
                    Change Password
                </Typography>
                <form onSubmit={passwordChangeHandler} className="flex flex-col gap-6">
                    <div>
                        <Typography variant="h6" color="blue-gray" className="mb-2">
                            Current Password
                        </Typography>
                        <Input
                            type="password"
                            size="lg"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
                    </div>
                    <div>
                        <Typography variant="h6" color="blue-gray" className="mb-2">
                            New Password
                        </Typography>
                        <Input
                            type="password"
                            size="lg"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
                    </div>
                    <div>
                        <Typography variant="h6" color="blue-gray" className="mb-2">
                            Confirm Password
                        </Typography>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            size="lg"
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
                    </div>
                    <div className="flex justify-center mt-6">
                        <Button className="w-full sm:w-[200px]" type="submit">
                            Update
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword;