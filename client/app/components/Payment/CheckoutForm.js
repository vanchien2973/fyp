import React, { useState, useEffect } from 'react';
import { useLoadUserQuery } from '@/app/redux/features/api/apiSlice';
import { useCreateOrderMutation } from '@/app/redux/features/orders/ordersApi';
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Alert, AlertCircle, AlertTitle, AlertDescription } from '../ui/alert';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/app/hooks/useSocket';

const CheckoutForm = ({ isOpen, setOpen, data, user }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState('');
    const [createOrder, { data: orderData, error: orderError }] = useCreateOrderMutation();
    const [loadUser, setLoadUser] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { refetch } = useLoadUserQuery({ skip: loadUser ? false : true });
    const router = useRouter();
    const socket = useSocket(user);

    useEffect(() => {
        if (!stripe || !elements) {
            console.log('Stripe.js has not loaded yet.');
        }
    }, [stripe, elements]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            console.error('Stripe.js has not loaded yet.');
            return;
        }
        setIsLoading(true);
        setMessage('');

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (error) {
            setMessage(error.message || 'An unexpected error occurred.');
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setIsLoading(false);
            createOrder({ courseId: data._id, paymentInfo: paymentIntent });
        } else {
            setMessage('Payment failed. Please try again.');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (orderData) {
            setLoadUser(true);
            // Notification cho admin
            socket.emit('notification', {
                type: 'order',
                subtype: 'new_order',
                title: "New Order Received",
                message: `New order for ${data.name} by ${user?.name}`,
                recipientRole: 'admin'
            });

            // Notification cho user
            socket.emit('notification', {
                type: 'order', 
                recipientId: user._id,
                title: "Course Purchase Successful",
                message: `You have successfully purchased the course: ${data.name}`,
                subtype: 'purchase_success'
            });
            refetch();
            window.location.reload();
            router.push(`/courses/course-access/${data._id}`);
        }
        if (orderError) {
            if ('data' in orderError) {
                toast.error(orderError.data.message);
            }
        }
    }, [orderData, orderError, data._id, router, socket]);

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Complete Your Purchase</DialogTitle>
                    <DialogDescription>
                        Please provide your payment details to complete the purchase of {data.name}.
                    </DialogDescription>
                </DialogHeader>
                <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
                    <LinkAuthenticationElement id='link-authentication-element' />
                    <PaymentElement id="payment-element"/>
                    <Button
                        disabled={isLoading || !stripe || !elements}
                        type="submit"
                        className="w-full"
                    >
                        {isLoading ? "Processing..." : `Pay $${data.price}`}
                    </Button>
                    {message && (
                        <Alert id='payment-message' variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CheckoutForm;