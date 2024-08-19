'use client'
import React, { useEffect, useState } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Box, IconButton, Typography } from '@mui/material';
import { 
    HomeOutlined as HomeOutlinedIcon, 
    ArrowForwardIos as ArrowForwardIosIcon, 
    ArrowBackIos as ArrowBackIosIcon, 
    PeopleOutlined as PeopleOutlinedIcon, 
    ReceiptOutlined as ReceiptOutlinedIcon, 
    BarChartOutlined as BarChartOutlinedIcon, 
    MapOutlined as MapOutlinedIcon, 
    Groups as GroupsIcon, 
    OndemandVideo as OndemandVideoIcon, 
    VideoCall as VideoCallIcon, 
    Wysiwyg as WysiwygIcon, 
    ManageHistory as ManageHistoryIcon, 
    Settings as SettingsIcon, 
    ExitToApp as ExitToAppIcon, 
    Web as WebIcon, 
    Quiz as QuizIcon 
} from '@mui/icons-material';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { tokens } from '@/app/utils/ThemeAdmin';
import dynamic from 'next/dynamic';
import { useTheme } from '@emotion/react';

const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), {
  ssr: false
});

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <MenuItem
            active={selected === title}
            style={{ color: colors.grey[100] }}
            onClick={() => setSelected(title)}
            icon={icon}
        >
            <Typography>{title}</Typography>
            <Link href={to} />
        </MenuItem>
    );
};

const animateMenu = {
    initial: { x: -300, y: -20 },
    final: { x: 0, y: 0 },
    transition: { damping: 10, bounce: 0.6 },
};

const AdminSidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1200);
    const [selected, setSelected] = useState('Dashboard');

    useEffect(() => {
        const handleResize = () => {
            setIsCollapsed(window.innerWidth <= 1200);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const dataItems = [
        { title: 'Users', to: '/admin/users', icon: <GroupsIcon /> },
        { title: 'Invoices', to: '/admin/invoices', icon: <ReceiptOutlinedIcon /> },
    ];

    const contentItems = [
        { title: 'Create Courses', to: '/admin/create-courses', icon: <VideoCallIcon /> },
        { title: 'Live Courses', to: '/admin/courses', icon: <OndemandVideoIcon /> },
    ];

    const customizationItems = [
        { title: 'Hero', to: '/admin/hero', icon: <WebIcon /> },
        { title: 'FAQ', to: '/faq', icon: <QuizIcon /> },
        { title: 'Categories', to: '/admin/categories', icon: <WysiwygIcon /> },
    ];

    const controllersItems = [
        { title: 'Manage Team', to: '/admin/team', icon: <PeopleOutlinedIcon /> },
    ];

    const analyticsItems = [
        { title: 'Courses Analytics', to: '/admin/courses-analytics', icon: <BarChartOutlinedIcon /> },
        { title: 'Orders Analytics', to: '/admin/orders-analytics', icon: <MapOutlinedIcon /> },
        { title: 'Users Analytics', to: '/admin/users-analytics', icon: <ManageHistoryIcon /> },
    ];

    const extrasItems = [
        { title: 'Settings', to: '/admin/settings', icon: <SettingsIcon /> },
        { title: 'Logout', to: '/', icon: <ExitToAppIcon /> },
    ];

    const renderCategory = (items, title, delay) => (
        <MotionDiv variants={animateMenu} initial='initial' animate='final' transition={{ delay }} >
            <Typography
                variant='h6'
                className={`${isCollapsed ? 'hidden' : ''}`}
                color={colors.blueAccent[400]}
                fontWeight='bold'
                fontSize='1rem'
            >
                {title}
            </Typography>
            {items.map((data, index) => (
                <Item
                    key={index}
                    title={data.title}
                    to={data.to}
                    icon={data.icon}
                    selected={selected}
                    setSelected={setSelected}
                />
            ))}
        </MotionDiv>
    );

    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": { background: `${colors.primary[400]} !important` },
                "& .pro-icon-wrapper": { backgroundColor: 'transparent !important' },
                "& .pro-inner-item": { padding: '5px 25px 0px 20px !important' },
                "& .pro-inner-item:hover": { color: '#868dfb !important' },
                "& .pro-menu-item.active": { color: '#6870fa !important' },
            }}
            className='h-screen'
        >
            <ProSidebar collapsed={isCollapsed} width={250}>
                <Menu iconShape='square'>
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <ArrowForwardIosIcon sx={{ fontSize: '2rem', color: colors.grey[300] }} /> : undefined}
                        className={`${isCollapsed ? '' : 'ml-1'} text-${colors.grey[100]}`}
                    >
                        {!isCollapsed && (
                            <Box className='flex justify-between items-center'>
                                <Typography variant='h3' color={colors.grey[100]}>
                                    <Link href='/'>ELP</Link>
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <ArrowBackIosIcon sx={{ fontSize: '1.7rem', color: colors.grey[300] }} />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>
                    {!isCollapsed && (
                        <Box className='flex flex-col items-center justify-center mt-5'>
                            <Box className='rounded-full overflow-hidden hover:shadow-lg hover:shadow-slate-400/50'>
                                <img
                                    src={user.avatar ? user.avatar.url : '/assets/avatar.png'}
                                    className='w-[80px] h-[80px]'
                                />
                            </Box>
                            <Box className='flex flex-col items-center justify-center gap-y-1 mt-3'>
                                <Typography variant='h2' color={colors.grey[100]}>
                                    {user?.name}
                                </Typography>
                                <Typography variant='h5' color={colors.greenAccent[500]} fontWeight='bold'>
                                    - {user?.role} -
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    <MotionDiv 
                        className={`flex flex-col justify-between ${isCollapsed ? 'mt-[4rem]' : 'px-[10%] pt-[8%]'} space-y-7`}
                        variants={animateMenu}
                        initial='initial'
                        animate='final'
                        transition='transition'
                    >
                        <MotionDiv variants={animateMenu} initial='initial' animate='final' transition={{ delay: 0.1 }}>
                            <Item
                                title={isCollapsed ? '' : 'Dashboard'}
                                to='/'
                                icon={<HomeOutlinedIcon sx={{ fontSize: '1.7rem' }} />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                        </MotionDiv>
                        {renderCategory(dataItems, "Data", 0.15)}
                        {renderCategory(contentItems, "Pages", 0.2)}
                        {renderCategory(customizationItems, "Charts", 0.25)}
                        {renderCategory(controllersItems, "Data", 0.15)}
                        {renderCategory(analyticsItems, "Pages", 0.2)}
                        {renderCategory(extrasItems, "Charts", 0.25)}
                    </MotionDiv>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default AdminSidebar;
