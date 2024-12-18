import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['read', 'unread'],
        default: 'unread'
    },
    type: {
        type: String,
        enum: ['system', 'order', 'forum', 'course'],
        required: true
    }
}, { timestamps: true });

const NotificationModel = mongoose.model("Notification", notificationSchema);

export default NotificationModel;