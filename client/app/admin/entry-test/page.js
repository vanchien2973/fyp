'use client'
import ListEntryTest from '@/app/components/Admin/entry-test/entry-test-table/ListEntryTest';
import { Breadcrumbs } from '@/app/components/Admin/layouts/Breadcrumbs';
import PageContainer from '@/app/components/Admin/layouts/PageContainer';
import React from 'react';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin/dashboard' },
    { title: 'Entry Test', link: '/admin/courses' }
  ];

const page = () => {
    return (
        <>
            <PageContainer>
                <div className="space-y-2">
                    <Breadcrumbs items={breadcrumbItems} />
                    <ListEntryTest/>
                </div>
            </PageContainer>
        </>
    )
}

export default page;
