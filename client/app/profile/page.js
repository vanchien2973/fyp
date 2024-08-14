'use client'
import React, { useState } from 'react'
import Protected from '../hooks/UseProtected';
import Heading from '../utils/Heading';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSelector } from 'react-redux';
import Profile from '../components/Profile/Profile';

const page = () => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(5);
    const [route, setRoute] = useState('Login');
    const { user } = useSelector((state) => state.auth);

    return (
        <div>
            <Protected>
                <Heading
                    title={`Profile - ${user.name}`}
                    description="LMS using MERN"
                    keywords="MERN, Redux, Redis"
                />
                <Header
                    open={open}
                    setOpen={setOpen}
                    activeItem={activeItem}
                    setRoute={setRoute}
                    route={route}
                />
                 <Profile user={user} />
                <Footer />
            </Protected>
        </div>
    )
}

export default page;
