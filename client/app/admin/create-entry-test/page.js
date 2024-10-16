'use client'
import CreateEntryTest from '@/app/components/Admin/entry-test/CreateEntryTest';
import { Breadcrumbs } from '@/app/components/Admin/layouts/Breadcrumbs';
import PageContainer from '@/app/components/Admin/layouts/PageContainer';
import React from 'react';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin/dashboard' },
    { title: 'Create Entry Test', link: '/admin/courses' }
  ];

const page = () => {
    return (
        <>
            <PageContainer>
                <div className="space-y-2">
                    <Breadcrumbs items={breadcrumbItems} />
                    <CreateEntryTest/>
                </div>
            </PageContainer>
        </>
    )
}

export default page;
