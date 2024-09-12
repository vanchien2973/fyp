'use client'
import UserAnalytics from '@/app/components/Admin/analytics/UserAnalytics';
import { Breadcrumbs } from '@/app/components/Admin/layouts/Breadcrumbs';
import PageContainer from '@/app/components/Admin/layouts/PageContainer';
import React from 'react';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin/dashboard' },
    { title: 'Users Analytics', link: 'admin/users-analytics' }
];

const page = () => {
    return (
        <>
            <PageContainer scrollable={true}>
                <div className="space-y-4">
                    <Breadcrumbs items={breadcrumbItems} />
                    <UserAnalytics />
                </div>
            </PageContainer>
        </>
    )
}

export default page;
