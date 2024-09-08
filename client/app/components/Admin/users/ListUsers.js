'use client'
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';
import { columns } from './Columns';
import { Separator } from '@/app/components/ui/separator';
import { DataTable } from '@/app/components/ui/data-table';
import { format } from 'timeago.js';
import { HeadingAdmin } from '@/app/components/ui/heading';
import Loader from '@/app/components/Loader/Loader';
import { useGetAllUsersQuery } from '@/app/redux/features/user/userApi';

const ListUsers = ({ isTeam }) => {
    const { isLoading, data, refetch } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });
    const rows = React.useMemo(() => {
        if (isTeam) {
            const newData = data && data.users.filter((item) => item.role === 'admin');
            if (newData) {
                return newData.map((item) => ({
                    id: item._id,
                    name: item.name,
                    email: item.email,
                    phoneNumber: item.phoneNumber,
                    role: item.role,
                    courses: item.courses.length,
                    created_at: format(item.createdAt)
                }));
            }
            return [];
        } else {
            if (data && data.users) {
                return data.users.map((item) => ({
                    id: item._id,
                    name: item.name,
                    email: item.email,
                    phoneNumber: item.phoneNumber,
                    role: item.role,
                    courses: item.courses.length,
                    created_at: format(item.createdAt)
                }));
            }
            return [];
        }
    }, [data, isTeam]);

    return (
        <> {
            isLoading ? (
                <Loader />
            ) : (
                <>
                    <div className="flex items-start justify-start">
                        <HeadingAdmin
                            title={`Users (${rows.length})`}
                            description="Manage users."
                        />
                    </div>
                    <Separator />
                    <DataTable searchKey="name" columns={columns} data={rows} />
                </>
            )
        }

        </>
    )
}

export default ListUsers
