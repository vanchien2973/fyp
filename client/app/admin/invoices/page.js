'use client'
import { Breadcrumbs } from '@/app/components/Admin/layouts/Breadcrumbs';
import PageContainer from '@/app/components/Admin/layouts/PageContainer';
import ListInvoices from '@/app/components/Admin/orders/ListInvoices';
import React from 'react';

const breadcrumbItems = [
    { title: 'Courses', link: '/admin' },
    { title: 'Invoices', link: '/admin/invoice' }
  ];

const page = () => {
    return (
        <>
            <PageContainer>
                <div className="space-y-2">
                    <Breadcrumbs items={breadcrumbItems} />
                    <ListInvoices />
                </div>
            </PageContainer>
        </>
    )
}

export default page;
