'use client'
import CreateCourse from '@/app/components/Admin/courses/CreateCourse';
import { Breadcrumbs } from '@/app/components/Admin/layouts/Breadcrumbs';
import PageContainer from '@/app/components/Admin/layouts/PageContainer';
import React from 'react';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin/dashboard' },
    { title: 'Create Course', link: 'admin/create-courses' }
];

const page = () => {
    return (
        <>
            <PageContainer scrollable={true}>
                <div className="space-y-4">
                    <Breadcrumbs items={breadcrumbItems} />
                    <CreateCourse />
                </div>
            </PageContainer>
        </>
    )
}

export default page;
