import React, { useMemo, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetUsersAnalyticsQuery } from '@/app/redux/features/analytics/analyticsApi';
import Loader from '../../Loader/Loader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../ui/chart';

const UserAnalytics = () => {
    const { data, isLoading } = useGetUsersAnalyticsQuery({});

    const analyticsData = useMemo(() => {
        if (!data) return [];
        return data.users.last12Months.map((item) => ({
            date: item.month,
            count: item.count
        }));
    }, [data]);

    const chartConfig = {
        date: {
            label: 'Month'
        },
        count: {
            label: 'Users Count',
            color: 'hsl(var(--chart-1))'
        }
    };

    const getTrendInfo = useMemo(() => {
        if (analyticsData.length < 2) return { trend: 'neutral', percentage: 0 };
        
        const latestMonth = analyticsData[analyticsData.length - 1].count;
        const previousMonth = analyticsData[analyticsData.length - 2].count;
        const difference = latestMonth - previousMonth;
        const percentage = ((difference / previousMonth) * 100).toFixed(2);
        
        return {
            trend: difference >= 0 ? 'up' : 'down',
            percentage: Math.abs(percentage)
        };
    }, [analyticsData]);

    const getDateRange = useMemo(() => {
        if (analyticsData.length < 2) return 'N/A';
        const firstMonth = analyticsData[0].date;
        const lastMonth = analyticsData[analyticsData.length - 1].date;
        return `${firstMonth} - ${lastMonth}`;
    }, [analyticsData]);


    const total = useMemo(() => ({
        count: analyticsData.reduce((acc, curr) => acc + curr.count, 0)
    }), [analyticsData]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <Card>
                    <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                        <CardTitle>User Analytics</CardTitle>

                        <CardDescription>
                            Showing total users for the last {analyticsData.length} months
                        </CardDescription>
                        </div>
                        <div className="flex">
                            <button
                                key="count"
                                data-active={'count'}
                                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                            >
                                <span className="text-xs text-muted-foreground">
                                    {chartConfig.count.label}
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    {total.count.toLocaleString()}
                                </span>
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={chartConfig}
                            className="aspect-auto h-[310px] w-full"
                        >
                            <AreaChart
                                 data={analyticsData}
                                margin={{
                                    left: 12,
                                    right: 12
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    minTickGap={32}
                                    tickFormatter={(value) => {
                                        const date = new Date(value);
                                        return date.toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric'
                                        });
                                    }}
                                />
                                <YAxis />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            className="w-[150px]"
                                            nameKey="views"
                                            labelFormatter={(value) => {
                                                return new Date(value).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    year: 'numeric'
                                                });
                                            }}
                                        />
                                    }
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    name={chartConfig.count.label}
                                    stroke={chartConfig.count.color}
                                    fill={chartConfig.count.color}
                                    fillOpacity={0.3}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 font-medium leading-none">
                                User growth trend: 
                                {getTrendInfo.trend === 'up' ? (
                                    <TrendingUp className="h-4 w-4 ml-2 text-green-500" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 ml-2 text-red-500" />
                                )}
                                <span className={getTrendInfo.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                                    {getTrendInfo.percentage}%
                                </span>
                            </div>
                            <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                {getDateRange}
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </>
    )
}

export default UserAnalytics