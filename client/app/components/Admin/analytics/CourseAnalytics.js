import { useGetCoursesAnalyticsQuery } from '@/app/redux/features/analytics/analyticsApi'
import React, { useState, useMemo } from 'react'
import Loader from '../../Loader/Loader'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '../../ui/chart';

export const description = 'An interactive bar chart for course analytics';

const CourseAnalytics = () => {
    const { data, isLoading, isError } = useGetCoursesAnalyticsQuery({});

    const analyticsData = useMemo(() => {
        if (!data) return [];
        return data.courses.last12Months.map((item) => ({
            date: item.month,
            count: item.count
        }));
    }, [data]);

    const [activeChart, setActiveChart] = useState('count');

    const chartConfig = {
        date: {
            label: 'Month'
        },
        count: {
            label: 'Course Count',
            color: 'hsl(var(--chart-1))'
        }
    };

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
                            <CardTitle>Course Analytics</CardTitle>
                            <CardDescription>
                                Showing course count for the last 12 months
                            </CardDescription>
                        </div>
                        <div className="flex">
                            <button
                                key="count"
                                data-active={activeChart === 'count'}
                                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                onClick={() => setActiveChart('count')}
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
                    <CardContent className="px-2 sm:p-6">
                        <ChartContainer
                            config={chartConfig}
                            className="aspect-auto h-[280px] w-full"
                        >
                            <BarChart
                                accessibilityLayer
                                data={analyticsData}
                                margin={{
                                    left: 12,
                                    right: 12
                                }}
                            >
                                <CartesianGrid vertical={false} />
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
                                <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            )}
        </>
    )
}

export default CourseAnalytics