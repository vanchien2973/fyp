import { Server as SocketIOServer } from 'socket.io';

let io;

export const initSocketIOServer = (server) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            credentials: true
        },
        transports: ['websocket']
    });

    // Lưu trữ mapping của user và socket
    const userSockets = new Map();
    const adminSockets = new Set();

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Xử lý user join với role
        socket.on('join', ({ userId, role }) => {
            if (role === 'admin') {
                adminSockets.add(socket.id);
                socket.join('admin-room');
            }
            
            // Luôn join user vào room cá nhân, kể cả admin
            userSockets.set(userId.toString(), socket.id);
            socket.join(userId.toString());
        });

        // Xử lý notifications
        socket.on('notification', async (data) => {
            try {                
                // Xử lý notification cho admin
                if (data.recipientRole === 'admin') {
                    io.to('admin-room').emit('newNotification', data);
                }
                
                // Xử lý notification cho user cụ thể
                if (data.recipientId) {
                    const recipientRoom = data.recipientId.toString();
                    io.to(recipientRoom).emit('newNotification', data);
                }

            } catch (error) {
                console.error('Socket notification error:', error);
            }
        });

        // Xử lý disconnect
        socket.on('disconnect', () => {
            adminSockets.delete(socket.id);
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(userId);
                    socket.leave(userId.toString());
                    break;
                }
            }
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

export { io };