'use client'
import ListCourses from '@/app/components/Admin/courses/courses-table/ListCourses';
import { Breadcrumbs } from '@/app/components/Admin/layouts/Breadcrumbs';
import PageContainer from '@/app/components/Admin/layouts/PageContainer';
import React from 'react';

const breadcrumbItems = [
    { title: 'Courses', link: '/admin/dashboard' },
    { title: 'List Courses', link: '/admin/courses' }
  ];

const page = () => {
    return (
        <>
            <PageContainer>
                <div className="space-y-2">
                    <Breadcrumbs items={breadcrumbItems} />
                    <ListCourses />
                </div>
            </PageContainer>
        </>
    )
}

export default page;
