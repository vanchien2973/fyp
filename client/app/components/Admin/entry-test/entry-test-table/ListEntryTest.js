import React from 'react';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { columns } from './Columns';
import { Separator } from '@/app/components/ui/separator';
import { DataTable } from '@/app/components/ui/data-table';
import { format } from 'timeago.js';
import { Plus } from 'lucide-react';
import { HeadingAdmin } from '@/app/components/ui/heading';
import Loader from '@/app/components/Loader/Loader';
import { useGetAllEntranceTestsQuery } from '@/app/redux/features/entry-test/entryTestApi';

const ListEntryTest = () => {
    const router = useRouter();
    const { isLoading, data } = useGetAllEntranceTestsQuery({}, { refetchOnMountOrArgChange: true });
    
    const rows = React.useMemo(() => {
        if (!data || !data.tests || !Array.isArray(data.tests)) return [];
        return data.tests.map(test => ({
            _id: test._id,
            title: test.title,
            description: test.description,
            testType: test.testType,
            createdAt: test.createdAt ? format(test.createdAt) : 'N/A'
        }));
    }, [data]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div className="flex items-start justify-between">
                        <HeadingAdmin
                            title={`Entry Tests (${rows.length})`}
                            description="Manage entry tests."
                        />
                        <Button
                            className="text-xs md:text-sm"
                            onClick={() => router.push(`/admin/create-entry-test`)}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add New
                        </Button>
                    </div>
                    <Separator />
                    <DataTable searchKey="title" columns={columns} data={rows} />
                </>
            )}
        </>
    );
};

export default ListEntryTest;