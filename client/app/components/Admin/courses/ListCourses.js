'use client'
import React from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '@/app/utils/ThemeAdmin';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { useGetAllCoursesQuery } from '@/app/redux/features/courses/coursesApi';
import Loader from '../../Loader/Loader';
import { format } from 'timeago.js'

const ListCourses = () => {
    const theme = useTheme();
    const color = tokens(theme.palette.mode);
    const { isLoading, data, error } = useGetAllCoursesQuery({});

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'ratings', headerName: 'Ratings', flex: .5 },
        { field: 'purchased', headerName: 'Purchased', flex: .5 },
        { field: 'created_at', headerName: 'Created At', flex: 0.5 },
        {
            field: ' ',
            headerName: 'Edit',
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <>
                        <Button>
                            <EditOutlined size={20} />
                        </Button>
                    </>
                )
            }
        },
        {
            field: '',
            headerName: 'Delete',
            flex: 0.2,
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
    {
        data && data.courses.forEach((item) => {
            rows.push({
                id: item._id,
                name: item.name,
                ratings: item.ratings,
                purchased: item.purchased,
                created_at: format(item.createdAt),
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

export default ListCourses
