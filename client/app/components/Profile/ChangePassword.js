'use client'
import React, { useEffect, useState } from 'react'
import { useUpdatePasswordMutation } from '@/app/redux/features/user/userApi';
import toast from 'react-hot-toast';
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

    const isValidPassword = (password) => {
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters!");
            return false;
        }

        if (!/\d/.test(password)) {
            toast.error("Password must contain at least one number!");
            return false;
        }

        if (!/[a-z]/.test(password)) {
            toast.error("Password must contain at least one lowercase letter!");
            return false;
        }

        if (!/[A-Z]/.test(password)) {
            toast.error("Password must contain at least one uppercase letter!");
            return false;
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            toast.error("Password must contain at least one special character!");
            return false;
        }

        return true;
    };

    const passwordChangeHandler = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All fields are required");
            return;
        }

        if (!isValidPassword(currentPassword)) {
            return;
        }

        if (!isValidPassword(newPassword)) {
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Check if new password is same as current
        if (currentPassword === newPassword) {
            toast.error("New password cannot be the same as the current password");
            return;
        }

        try {
            await updatePassword({ currentPassword, newPassword });
        } catch (error) {
            toast.error("Failed to update password");
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success("Password changed successfully");
        }
        if (error) {
            if ('data' in error) {
                toast.error(error.data?.message || "Invalid current password");
            }
        }
    }, [isSuccess, error]);

    return (
        <div className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-center">Change Password</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={passwordChangeHandler} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-center mt-6">
                        <Button className="w-full sm:w-[200px]" type="submit">
                            Update
                        </Button>
                    </div>
                </form>
            </CardContent>
        </div>
    )
}

export default ChangePassword;