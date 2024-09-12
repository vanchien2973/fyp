'use client'
import { Breadcrumbs } from '@/app/components/Admin/layouts/Breadcrumbs';
import PageContainer from '@/app/components/Admin/layouts/PageContainer';
import ListUsers from '@/app/components/Admin/users/ListUsers';
import React from 'react';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin' },
    { title: 'List Users', link: 'admin/users' }
];

const page = () => {
    return (
        <>
            <PageContainer>
                <div className="space-y-2">
                    <Breadcrumbs items={breadcrumbItems} />
                    <ListUsers />
                </div>
            </PageContainer>
        </>
    )
}

export default page;
