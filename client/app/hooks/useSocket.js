import { useEffect, useRef } from 'react';
import socketIO from 'socket.io-client';
import toast from 'react-hot-toast';

export const useSocket = (user) => {
    const socketRef = useRef(null);
    const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || '';

    useEffect(() => {
        if (!user?._id) return;

        // Tạo socket connection
        socketRef.current = socketIO(ENDPOINT, { 
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        // Xử lý kết nối
        socketRef.current.on('connect', () => {
            // Join room với userId
            socketRef.current.emit('join', {
                userId: user._id,
                role: user.role
            });
        });

        // // Xử lý lỗi kết nối
        // socketRef.current.on('connect_error', (error) => {
        //     toast.error('Unable to connect to notification service');
        // });

        // // Xử lý mất kết nối
        // socketRef.current.on('disconnect', () => {
        //     console.log('Socket disconnected');
        // });

        // Cleanup
        return () => {
            if (socketRef.current) {
                socketRef.current.off('connect');
                // socketRef.current.off('connect_error');
                // socketRef.current.off('disconnect');
                socketRef.current.off('newNotification');
                socketRef.current.disconnect();
            }
        };
    }, [user]);

    return socketRef.current;
}; 