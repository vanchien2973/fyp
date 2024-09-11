'use client'
import CourseAnalytics from '@/app/components/Admin/analytics/CourseAnalytics';
import { Breadcrumbs } from '@/app/components/Admin/layouts/Breadcrumbs';
import PageContainer from '@/app/components/Admin/layouts/PageContainer';
import React from 'react';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin/dashboard' },
    { title: 'Courses Analytics', link: 'admin/courses-analytics' }
];

const page = () => {
    return (
        <>
            <PageContainer scrollable={true}>
                <div className="space-y-4">
                    <Breadcrumbs items={breadcrumbItems} />
                    <CourseAnalytics />
                </div>
            </PageContainer>
        </>
    )
}

export default page;
