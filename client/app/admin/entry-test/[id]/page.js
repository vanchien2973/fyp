'use client'
import ViewEntryTest from '@/app/components/Admin/entry-test/ViewEntryTest';
import { Breadcrumbs } from '@/app/components/Admin/layouts/Breadcrumbs';
import PageContainer from '@/app/components/Admin/layouts/PageContainer';
import React from 'react';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin' },
    { title: 'View Entry Test', link: 'admin/admin/entry-test' }
];

const page = ({ params }) => {
    const id = params?.id;
    return (
        <>
            <PageContainer scrollable={true}>
                <div className="space-y-4">
                    <Breadcrumbs items={breadcrumbItems} />
                    <ViewEntryTest id={id}/>
                </div>
            </PageContainer>
        </>
    )
}

export default page;
