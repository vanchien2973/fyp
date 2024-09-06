'use client'
import EditCourse from '@/app/components/Admin/courses/EditCourse';
import { Breadcrumbs } from '@/app/components/Admin/layouts/Breadcrumbs';
import PageContainer from '@/app/components/Admin/layouts/PageContainer';
import React from 'react';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin/dashboard' },
    { title: 'Create Course', link: 'admin/create-courses' }
];

const page = ({ params }) => {
    const id = params?.id;
    return (
        <>
            <PageContainer scrollable={true}>
                <div className="space-y-4">
                    <Breadcrumbs items={breadcrumbItems} />
                    <EditCourse id={id}/>
                </div>
            </PageContainer>
        </>
    )
}

export default page;
