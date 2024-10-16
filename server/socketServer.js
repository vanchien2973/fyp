import { Server as SocketIOServer } from 'socket.io';
import NotificationModel from './src/models/notification.model';

export const initSocketIOServer = (server) => {
    const io = new SocketIOServer(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('notification', async (data) => {
            try {
                let notification;
                if (data.type === 'system') {
                    // Create system notification (for admin)
                    notification = await NotificationModel.create({
                        title: data.title,
                        message: data.message,
                        type: 'system'
                    });
                    // Broadcast to admin
                    io.emit('newNotification', { type: 'system', notification });
                } else {
                    // Create user notification
                    notification = await NotificationModel.create({
                        recipient: data.userId,
                        title: data.title,
                        message: data.message,
                        type: data.type || 'user'
                    });
                    // Emit to specific user
                    io.to(data.userId).emit('newNotification', { type: 'user', notification });
                    
                    // If it's a forum post, also send as system notification, but don't create a new DB entry
                    if (data.type === 'forum') {
                        io.emit('newNotification', { type: 'system', notification });
                    }
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