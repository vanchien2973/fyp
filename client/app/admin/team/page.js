'use client'
import { Breadcrumbs } from '@/app/components/Admin/layouts/Breadcrumbs';
import PageContainer from '@/app/components/Admin/layouts/PageContainer';
import ListUsers from '@/app/components/Admin/users/ListUsers';
import React from 'react';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin/dashboard' },
    { title: 'List Users', link: 'admin/users' }
];

const page = () => {
    return (
        <>
            <PageContainer scrollable={true}>
                <div className="space-y-4">
                    <Breadcrumbs items={breadcrumbItems} />
                    <ListUsers isTeam={true}/>
                </div>
            </PageContainer>
        </>
    )
}

export default page;
