'use client'
import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import Heading from '@/app/utils/Heading';
import { useGetCourseDetailQuery } from '@/app/redux/features/courses/coursesApi';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';
import CourseDisplay from './CourseDisplay';
import { useCreatePaymentIntentMutation, useGetStripePushlishableKeyQuery } from '@/app/redux/features/orders/ordersApi';
import { loadStripe } from '@stripe/stripe-js';

const CourseDetail = ({ id }) => {
    const [route, setRoute] = useState('Login');
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useGetCourseDetailQuery(id);
    const { data: config } = useGetStripePushlishableKeyQuery();
    const [createPaymentIntent, { data: paymentIntentData }] = useCreatePaymentIntentMutation();
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    useEffect(() => {
        if (config) {
            setStripePromise(loadStripe(config?.stripePublishableKey));
        }
    }, [config]);

    useEffect(() => {
        if (data) {
            const amount = Math.round(data.course.price * 100);
            createPaymentIntent(amount);
        }
    }, [data, createPaymentIntent]);

    useEffect(() => {
        if (paymentIntentData) {
            setClientSecret(paymentIntentData?.client_secret);
        }
    }, [paymentIntentData]);

    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <Heading
                            title={data?.course.name + ' - ELP'}
                            description={'ELP is a english center.'}
                            keywords={data?.course?.tags}
                        />
                        <Header
                            route={route}
                            setRoute={setRoute}
                            open={open}
                            setOpen={setOpen}
                            activeItem={1}
                        />
                        {
                            stripePromise && (
                                <CourseDisplay data={data?.course} stripePromise={stripePromise} clientSecret={clientSecret} />
                            )
                        }
                        <Footer />
                    </>
                )
            }
        </>
    )
}

export default CourseDetail
