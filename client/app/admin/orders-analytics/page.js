'use client'
import OrderAnalytics from '@/app/components/Admin/analytics/OrderAnalytics';
import { Breadcrumbs } from '@/app/components/Admin/layouts/Breadcrumbs';
import PageContainer from '@/app/components/Admin/layouts/PageContainer';
import React from 'react';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Orders Analytics', link: 'admin/orders-analytics' }
];

const page = () => {
    return (
        <>
            <PageContainer scrollable={true}>
                <div className="space-y-4">
                    <Breadcrumbs items={breadcrumbItems} />
                    <OrderAnalytics />
                </div>
            </PageContainer>
        </>
    )
}

export default page;
