import { Server as SocketIOServer } from 'socket.io';

export const initSocketIOServer = (server) => {
    const io = new SocketIOServer(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Listen for 'notification' event from FE
        socket.on('notification', (data) => {
            // Broadcast the notification data to all connected clients (admin dashboard)
            io.emit('newNotification', data);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected'); 
        });
    });
};