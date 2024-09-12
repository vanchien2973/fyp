'use client'
import EditFaq from '@/app/components/Admin/customization/EditFaq';
import { Breadcrumbs } from '@/app/components/Admin/layouts/Breadcrumbs';
import PageContainer from '@/app/components/Admin/layouts/PageContainer';
import React from 'react';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin' },
    { title: 'FAQ', link: 'admin/faq' }
];

const page = () => {
    return (
        <>
            <PageContainer scrollable={true}>
                <div className="space-y-4">
                    <Breadcrumbs items={breadcrumbItems} />
                    <EditFaq />
                </div>
            </PageContainer>
        </>
    )
}

export default page;
