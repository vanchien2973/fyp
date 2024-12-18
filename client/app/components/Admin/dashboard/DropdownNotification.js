import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useGetUserNotificationsQuery, useGetSystemNotificationsQuery, useUpdateNotificationStatusMutation, useDeleteNotificationMutation } from '@/app/redux/features/notifications/notificationsApi';
import { useSelector } from 'react-redux';
import { useSocket } from '@/app/hooks/useSocket';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../ui/popover";
import { Button } from "../../ui/button";
import { ScrollArea } from "../../ui/scroll-area";
import { Badge } from "../../ui/badge";
import { format } from 'timeago.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";

const DropdownNotifications = () => {
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user && user.role === 'admin';
    
    const { data: userData, refetch: refetchUserData } = useGetUserNotificationsQuery(undefined, {
        skip: !user
    });
    const { data: adminData, refetch: refetchAdminData } = useGetSystemNotificationsQuery(undefined, {
        skip: !isAdmin
    });
    
    const [updateNotificationStatus] = useUpdateNotificationStatusMutation();
    const [deleteNotification] = useDeleteNotificationMutation();
    const [notifications, setNotifications] = useState([]);
    const [audio] = useState(new Audio('https://res.cloudinary.com/du3a3d1dh/video/upload/v1729144964/djfftb2qb0tbvikx5une.mp3'));

    const socket = useSocket(user);

    const playNotificationSound = useCallback(async () => {
        try {
            await audio.play();
        } catch (error) {
            console.log("Audio play failed:", error);
        }
    }, [audio]);

    useEffect(() => {
        if (!socket || !user) return;

        const handleNewNotification = async (data) => {
            try {                
                const shouldHandleNotification = (
                    (data.recipient === user._id.toString()) || 
                    (isAdmin && ['system', 'new_post', 'new_order'].includes(data.type))
                );

                if (shouldHandleNotification) {
                    console.log('Received notification:', data);
                    
                    if (data.recipient === user._id.toString()) {
                        await refetchUserData();
                    }
                    if (isAdmin) {
                        await refetchAdminData();
                    }
                    
                    await playNotificationSound();
                }
            } catch (error) {
                console.error('Error handling notification:', error);
            }
        };

        socket.on('newNotification', handleNewNotification);
        
        return () => {
            socket.off('newNotification');
        };
    }, [user, isAdmin, socket]);

    useEffect(() => {
        audio.load();
    }, [audio]);

    useEffect(() => {
        // Tạo Set để theo dõi ID thông báo đã xử lý
        const processedIds = new Set();
        const combinedNotifications = [];
        
        if (userData?.notifications) {
            userData.notifications.forEach(notification => {
                if (!processedIds.has(notification._id)) {
                    processedIds.add(notification._id);
                    combinedNotifications.push(notification);
                }
            });
        }
        
        if (isAdmin && adminData?.notifications) {
            adminData.notifications.forEach(notification => {
                if (!processedIds.has(notification._id)) {
                    processedIds.add(notification._id);
                    combinedNotifications.push(notification);
                }
            });
        }

        // Sắp xếp theo thời gian tạo mới nhất
        combinedNotifications.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        setNotifications(combinedNotifications);
    }, [userData, adminData, isAdmin]);

    const handleNotificationStatusChange = async (id) => {
        await updateNotificationStatus(id).unwrap();
        refetchUserData();
        if (isAdmin) {
            refetchAdminData();
        }
    };

    const handleDeleteNotification = async (id) => {
        await deleteNotification(id).unwrap();
        refetchUserData();
        if (isAdmin) {
            refetchAdminData();
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-6 w-6" />
                    {notifications.filter(n => n.status === 'unread').length > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5">
                            {notifications.filter(n => n.status === 'unread').length}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0">
                <div className="p-4 border-b bg-primary text-primary-foreground">
                    <h4 className="font-semibold text-lg">Notifications</h4>
                </div>
                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <p className="p-4 text-center text-muted-foreground">No notifications</p>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`border-b last:border-0 hover:bg-accent transition-colors duration-200 ${notification.status === 'unread' ? 'bg-accent/20' : ''
                                    }`}
                            >
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`text-sm font-medium ${notification.status === 'unread'
                                                ? 'text-primary font-semibold'
                                                : 'text-muted-foreground'
                                            }`}>
                                            {notification.title}
                                        </span>
                                        <div className="flex space-x-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleNotificationStatusChange(notification._id)}
                                                            className={notification.status === 'read' ? 'text-primary' : 'text-muted-foreground'}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{notification.status === 'read' ? 'Mark as unread' : 'Mark as read'}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteNotification(notification._id)}
                                                            className="text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Delete notification</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                    <p className={`text-sm ${notification.status === 'unread'
                                            ? 'text-foreground font-medium'
                                            : 'text-muted-foreground'
                                        } mb-1`}>
                                        {notification.message}
                                    </p>
                                    <span className="text-xs text-muted-foreground">
                                        {format(notification.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};

export default DropdownNotifications;