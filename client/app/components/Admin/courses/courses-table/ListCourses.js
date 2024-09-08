'use client'
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';
import { columns } from './Columns';
import { Separator } from '@/app/components/ui/separator';
import { DataTable } from '@/app/components/ui/data-table';
import { format } from 'timeago.js';
import { useGetAllCoursesQuery } from '@/app/redux/features/courses/coursesApi';
import { Plus } from 'lucide-react';
import { HeadingAdmin } from '@/app/components/ui/heading';
import Loader from '@/app/components/Loader/Loader';

const ListCourses = () => {
    const router = useRouter();
    const { isLoading, data, refetch } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
    const rows = React.useMemo(() => {
        if (data && data.courses) {
            return data.courses.map((item) => ({
                id: item._id,
                name: item.name,
                ratings: item.ratings,
                purchased: item.purchased,
                created_at: format(item.createdAt),
            }));
        }
        return [];
    }, [data]);
    return (
        <> {
            isLoading ? (
                <Loader />
            ) : (
                <>
                    <div className="flex items-start justify-between">
                        <HeadingAdmin
                            title={`Courses (${rows.length})`}
                            description="Manage courses."
                        />
                        <Button
                            className="text-xs md:text-sm"
                            onClick={() => router.push(`/admin/create-courses`)}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add New
                        </Button>
                    </div>
                    <Separator />
                    <DataTable searchKey="name" columns={columns} data={rows} />
                </>
            )
        }

        </>
    )
}

export default ListCourses
