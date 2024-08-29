'use client'
import React, { useState } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '@/app/utils/ThemeAdmin';
import { DeleteOutline, EditOutlined, EmailOutlined } from '@mui/icons-material';
import Loader from '../../Loader/Loader';
import { format } from 'timeago.js'
import { useGetAllUsersQuery } from '@/app/redux/features/user/userApi';
import { styles } from '@/app/styles/styles';

const ListUsers = ({ isTeam }) => {
    const theme = useTheme();
    const color = tokens(theme.palette.mode);
    const [active, setActive] = useState(false);
    const { isLoading, data, error } = useGetAllUsersQuery({});

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'name', headerName: 'Name', flex: .5 },
        { field: 'email', headerName: 'Email', flex: .5 },
        { field: 'phoneNumber', headerName: 'Phone Number', flex: .5 },
        { field: 'role', headerName: 'Role', flex: 0.5 },
        { field: 'courses', headerName: 'Purchased Courses', flex: 0.5 },
        { field: 'created_at', headerName: 'Created At', flex: 0.5 },
        {
            field: ' ',
            headerName: 'Email',
            flex: .3,
            renderCell: (params) => {
                return (
                    <>
                        <a href={`mailto:${params.row.email}`}>
                            <EmailOutlined size={20} />
                        </a>
                    </>
                )
            }
        },
        {
            field: '',
            headerName: 'Delete',
            flex: .3,
            renderCell: (params) => {
                return (
                    <>
                        <Button>
                            <DeleteOutline size={20} />
                        </Button>
                    </>
                )
            }
        },
    ];
    const rows = [];
    if (isTeam) {
        const newData = data && data.users.filter((item) => item.role === 'admin')
        newData && newData.forEach((item) => {
            rows.push({
                id: item._id,
                name: item.name,
                email: item.email,
                phoneNumber: item.phoneNumber,
                role: item.role,
                courses: item.courses.length,
                created_at: format(item.createdAt)
            });
        });
    } else {
        data && data.users.forEach((item) => {
            rows.push({
                id: item._id,
                name: item.name,
                email: item.email,
                phoneNumber: item.phoneNumber,
                role: item.role,
                courses: item.courses.length,
                created_at: format(item.createdAt)
            });
        });
    };

    return (
        <div className='ml-2 mt-5'>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <div className='w-full mt-8 flex items-center justify-center'>
                        <div className='w-[85%] rounded-lg overflow-hidden'>
                            <div className='flex justify-end'>
                                <div className={`${styles.button} !h-[40px] !w-[200px]`} onClick={() => setActive(!active)}>
                                    Add New Member
                                </div>
                            </div>
                            <Box
                                width={'100%'}
                                m='40px 0 0 0'
                                height='80vh'
                                sx={{
                                    "& .MuiDataGrid-root": {
                                        border: 'none',
                                        backgroundColor: color.primary[400]
                                    },
                                    "& .MuiDataGrid-cell": {
                                        borderBottom: 'none'
                                    },
                                    "& .name-column-cell": {
                                        color: color.greenAccent[400]
                                    },
                                    "& .MuiDataGrid-columnHeaders": {
                                        backgroundColor: color.blueAccent[700],
                                        borderBottom: 'none'
                                    },
                                    "& .MuiDataGrid-footerContainer": {
                                        backgroundColor: color.blueAccent[700],
                                        borderTop: 'none'
                                    },
                                    "& .MuiDataGrid-virtualScrollbar": {
                                        backgroundColor: color.primary[400],
                                    },
                                    "& .MuiCheckbox-root": {
                                        color: color.greenAccent[500]
                                    },
                                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                        color: `${color.grey[100]} !important`,
                                        marginBottom: '1rem'
                                    }
                                }}>
                                <DataGrid
                                    checkboxSelection
                                    components={{ Toolbar: GridToolbar }}
                                    rows={rows}
                                    columns={columns} />
                            </Box>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ListUsers
