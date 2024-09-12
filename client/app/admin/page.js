'use client'
import PageContainer from '@/app/components/Admin/layouts/PageContainer';
import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useGetAllInvoicesQuery } from '@/app/redux/features/orders/ordersApi';
import { useGetAllUsersQuery } from '../redux/features/user/userApi';
import Loader from '../components/Loader/Loader';
import CourseAnalytics from '../components/Admin/analytics/CourseAnalytics';
import UserAnalytics from '../components/Admin/analytics/UserAnalytics';
import OrdersAnalytics from '../components/Admin/analytics/OrderAnalytics';
import RecentSales from '../components/Admin/orders/RecentSales';

const Page = () => {
    const { isLoading: isLoadingInvoices, data: invoicesData } = useGetAllInvoicesQuery({});
    const { isLoading: isLoadingUsers, data: usersData } = useGetAllUsersQuery({});

    const { totalRevenue, totalUsers, totalOrders, revenueChange, userChange, orderChange } = useMemo(() => {
        if (!invoicesData || !usersData) return { totalRevenue: 0, totalUsers: 0, totalOrders: 0, revenueChange: 0, userChange: 0, orderChange: 0 };

        const totalRevenue = invoicesData.orders.reduce((sum, order) => sum + (order.price || 0), 0);
        const totalUsers = usersData.users.length;
        const totalOrders = invoicesData.orders.length;

        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const thisMonthRevenue = invoicesData.orders
            .filter(order => new Date(order.createdAt) > lastMonth)
            .reduce((sum, order) => sum + (order.price || 0), 0);

        const lastMonthRevenue = invoicesData.orders
            .filter(order => new Date(order.createdAt) <= lastMonth && new Date(order.createdAt) > new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, lastMonth.getDate()))
            .reduce((sum, order) => sum + (order.price || 0), 0);

        const revenueChange = lastMonthRevenue ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

        const thisMonthUsers = usersData.users.filter(user => new Date(user.createdAt) > lastMonth).length;
        const lastMonthUsers = usersData.users.filter(user => new Date(user.createdAt) <= lastMonth && new Date(user.createdAt) > new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, lastMonth.getDate())).length;
        const userChange = lastMonthUsers ? thisMonthUsers - lastMonthUsers : 0;

        const thisMonthOrders = invoicesData.orders.filter(order => new Date(order.createdAt) > lastMonth).length;
        const lastMonthOrders = invoicesData.orders.filter(order => new Date(order.createdAt) <= lastMonth && new Date(order.createdAt) > new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, lastMonth.getDate())).length;
        const orderChange = lastMonthOrders ? thisMonthOrders - lastMonthOrders : 0;

        return {
            totalRevenue,
            totalUsers,
            totalOrders,
            revenueChange: revenueChange.toFixed(1),
            userChange: userChange,
            orderChange
        };
    }, [invoicesData, usersData]);

    const isLoading = isLoadingInvoices || isLoadingUsers;

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <PageContainer scrollable={true}>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight">
                                Hi, Welcome back 👋
                            </h2>
                        </div>
                        <Tabs defaultValue="overview" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Total Revenue
                                            </CardTitle>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                className="h-4 w-4 text-muted-foreground"
                                            >
                                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                            </svg>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                                            <p className="text-xs text-muted-foreground">
                                                {revenueChange > 0 ? '+' : ''}{revenueChange}% from last month
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Total Users
                                            </CardTitle>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                className="h-4 w-4 text-muted-foreground"
                                            >
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{totalUsers}</div>
                                            <p className="text-xs text-muted-foreground">
                                                {userChange > 0 ? '+' : ''}{userChange} from last month
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Sales</CardTitle>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                className="h-4 w-4 text-muted-foreground"
                                            >
                                                <rect width="20" height="14" x="2" y="5" rx="2" />
                                                <path d="M2 10h20" />
                                            </svg>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{totalOrders}</div>
                                            <p className="text-xs text-muted-foreground">
                                                {orderChange > 0 ? '+' : ''}{orderChange} from last month
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                                    <div className="col-span-4">
                                        <CourseAnalytics />
                                    </div>
                                    <Card className="col-span-4 md:col-span-3">
                                        <CardHeader>
                                            <CardTitle>Recent Sales</CardTitle>
                                            <CardDescription>
                                                You made {orderChange} sales this month.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <RecentSales />
                                        </CardContent>
                                    </Card>
                                    <div className="col-span-4">
                                        <OrdersAnalytics />
                                    </div>
                                    <div className="col-span-4 md:col-span-3">
                                        <UserAnalytics />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </PageContainer>
            )}
        </>
    )
}

export default Page;