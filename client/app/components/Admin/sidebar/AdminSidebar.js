'use client'
import React, { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, Icon, IconButton, Typography } from '@mui/material';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import WebIcon from "@mui/icons-material/Web";
import QuizIcon from "@mui/icons-material/Quiz";
import avatarDefault from '../../../../public/assets/avatar.png';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';

const Item = ({ title, to, icon, selected, setSelected }) => {
    return (
        <MenuItem
            active={selected === title}
            onClick={() => setSelected(title)}
            icon={icon}
            className='text-black'
        >
            <Typography className='!text[16px] !font-Roboto'>{title}</Typography>
            <Link href={to} />
        </MenuItem>
    )
}

const AdminSidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const [logout, setLogout] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return null;
    }

    const logoutHandler = () => {
        setLogout(true);
    };

    return (
        <>
            <Box
                sx={{
                    "& .pro-sidebar-inner": {
                        background: `#fff !important`,
                    },
                    "& .pro-icon-wrapper": {
                        backgroundColor: "transparent !important",
                    },
                    "& .pro-inner-item": {
                        padding: "5px 35px 5px 20px !important",
                    },
                    "& .pro-inner-item:hover": {
                        color: "#868dfb !important",
                    },
                    "& .pro-menu-item.active": {
                        color: "#6870fa !important",
                    },
                }}
            >
                <Sidebar
                    collapsed={isCollapsed}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        height: '100vh',
                        width: isCollapsed ? '0%' : '16%',
                        // background: '#23272f'
                    }}
                >
                    <Menu iconShape='square'>
                        <MenuItem
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
                            style={{
                                margin: "10px 0 20px 0"
                            }}
                        >
                            {isCollapsed && (
                                <Box
                                    display='flex'
                                    justifyContent='space-between'
                                    alignItems='center'
                                    ml='15px'
                                    className='text-black'
                                >
                                    <Link href='/'>
                                        <h3 className='text-[25px] uppercase'>ELP</h3>
                                    </Link>
                                    <IconButton onClick={() => setIsCollapsed(!isCollapsed)} className='inline-block'>
                                        <ArrowBackIosIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </MenuItem>
                        {!isCollapsed && (
                            <Box mb='25px'>
                                <Box display='flex' justifyContent='center' alignItems='center'>
                                    <Image
                                        alt='profile-user'
                                        width={100}
                                        height={100}
                                        src={user.avatar ? user.avatar.url : avatarDefault}
                                        style={{
                                            cursor: 'pointer',
                                            borderRadius: '50%',
                                            border: '3px solid #5b6fe6'
                                        }}
                                    />
                                </Box>
                                <Box textAlign='center'>
                                    <Typography variant='h4' className='!text-[20px' sx={{ m: '10px 0 0 0' }}>
                                        {user?.name}
                                    </Typography>
                                    <Typography variant='h6' className='!text-[20px]' sx={{ m: '10px 0 0 0' }}>
                                        - {user?.role} -
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        <Box paddingLeft={isCollapsed ? undefined : '1-px'}>
                            <Item
                                title='Dashboard'
                                to='/admin'
                                icon={<HomeOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Typography variant='h5' className='!text-[18px] capitalize !font-[400]' sx={{ m: '15px 0 5px 25px' }}>
                                {!isCollapsed && 'Data'}
                            </Typography>
                            <Item
                                title='Users'
                                to='/admin/users'
                                icon={<GroupsIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Item
                                title='Invoices'
                                to='/admin/invoices'
                                icon={<ReceiptOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Typography variant='h5' className='!text-[18px] capitalize !font-[400]' sx={{ m: '15px 0 5px 20px' }}>
                                {!isCollapsed && 'Content'}
                            </Typography>
                            <Item
                                title='Create Courses'
                                to='/admin/create-courses'
                                icon={<VideoCallIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Item
                                title='Live Courses'
                                to='/admin/courses'
                                icon={<OndemandVideoIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Typography variant='h5' className='!text-[18px] capitalize !font-[400]' sx={{ m: '15px 0 5px 20px' }}>
                                {!isCollapsed && 'Customization'}
                            </Typography>
                            <Item
                                title='Hero'
                                to='/admin/hero'
                                icon={<WebIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Item
                                title='FAQ'
                                to='/faq'
                                icon={<QuizIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Item
                                title='Categories'
                                to='/admin/categoiries'
                                icon={<WysiwygIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Typography variant='h5' className='!text-[18px] capitalize !font-[400]' sx={{ m: '15px 0 5px 20px' }}>
                                {!isCollapsed && 'Controllers'}
                            </Typography>
                            <Item
                                title='Manage Team'
                                to='/admin/team'
                                icon={<PeopleOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Typography variant='h5' className='!text-[18px] capitalize !font-[400]' sx={{ m: '15px 0 5px 20px' }}>
                                {!isCollapsed && 'Analytics'}
                            </Typography>
                            <Item
                                title='Courses Analytics'
                                to='/admin/courses-analytics'
                                icon={<BarChartOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Item
                                title='Orders Analytics'
                                to='/admin/orders-analytics'
                                icon={<MapOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Item
                                title='Users Analytics'
                                to='/admin/users-analytics'
                                icon={<ManageHistoryIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Typography variant='h5' className='!text-[18px] capitalize !font-[400]' sx={{ m: '15px 0 5px 20px' }}>
                                {!isCollapsed && 'Extras'}
                            </Typography>
                            <Item
                                title='Settings'
                                to='/admin/settings'
                                icon={<SettingsIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <div onClick={logoutHandler}>
                                <Item
                                    title='Exit'
                                    to='/admin/orders-analytics'
                                    icon={<ExitToAppIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                            </div>
                        </Box>
                    </Menu>
                </Sidebar>
            </Box>
        </>
    )
}

export default AdminSidebar;
