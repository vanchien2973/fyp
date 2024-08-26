import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    paymentInfor: {
        type: Object,
        // required: true
    },
}, { timestamps: true });

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;
