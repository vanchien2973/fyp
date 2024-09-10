'use client'
import EditCategories from '@/app/components/Admin/customization/EditCategories';
import { Breadcrumbs } from '@/app/components/Admin/layouts/Breadcrumbs';
import PageContainer from '@/app/components/Admin/layouts/PageContainer';
import React from 'react';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin/dashboard' },
    { title: 'Categories', link: 'admin/categories' }
];

const page = () => {
    return (
        <>
            <PageContainer scrollable={true}>
                <div className="space-y-4">
                    <Breadcrumbs items={breadcrumbItems} />
                    <EditCategories />
                </div>
            </PageContainer>
        </>
    )
}

export default page;
