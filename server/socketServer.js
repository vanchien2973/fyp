import { Server as SocketIOServer } from 'socket.io';
import NotificationModel from './src/models/notification.model';


export const initSocketIOServer = (server) => {
    const io = new SocketIOServer(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('notification', async (data) => {
            try {
                if (data.type === 'system') {
                    // Create system notification (for admin)
                    await NotificationModel.create({
                        title: data.title,
                        message: data.message,
                        type: 'system'
                    });
                    // Broadcast to admin
                    io.emit('newNotification', { type: 'system' });
                } else {
                    // Create user notification
                    await NotificationModel.create({
                        recipient: data.userId,
                        title: data.title,
                        message: data.message,
                        type: 'user'
                    });
                    // Emit to specific user
                    io.to(data.userId).emit('newNotification', { type: 'user' });
                }
            } catch (error) {
                console.error('Error creating notification:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};