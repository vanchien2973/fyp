'use client'
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetEntranceTestByIdQuery } from '@/app/redux/features/entry-test/entryTestApi';
import Heading from '@/app/utils/Heading';
import Header from '@/app/components/Layouts/Header';
import Footer from '@/app/components/Layouts/Footer';
import TakeEntryTest from '@/app/components/EntryTest/TakeEntryTest';
import Loader from '@/app/components/Loader/Loader';

const Page = () => {
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState('Login');
    const { data, isLoading, isError } = useGetEntranceTestByIdQuery(id);
    const test = data?.test;

    if (isLoading) return <Loader />;
    if (!test) return null;

    return (
        <>
            <Heading
                title={`${test.title} - ELP`}
                description={test.description}
                keywords="Entry test, placement test, English level"
            />
            <Header
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                route={route}
            />
            <TakeEntryTest test={test} />
            <Footer />
        </>
    );
};

export default Page; 