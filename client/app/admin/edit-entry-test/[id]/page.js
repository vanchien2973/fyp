'use client'
import EditEntryTest from '@/app/components/Admin/entry-test/EditEntryTest';
import { Breadcrumbs } from '@/app/components/Admin/layouts/Breadcrumbs';
import PageContainer from '@/app/components/Admin/layouts/PageContainer';
import React from 'react';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Edit Entry Test', link: 'admin/edit-entry-test' }
];

const page = ({ params }) => {
    const id = params?.id;
    return (
        <>
            <PageContainer scrollable={true}>
                <div className="space-y-4">
                    <Breadcrumbs items={breadcrumbItems} />
                    <EditEntryTest id={id}/>
                </div>
            </PageContainer>
        </>
    )
}

export default page;
