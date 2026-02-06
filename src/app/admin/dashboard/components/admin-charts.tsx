
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';

interface ChartDataPoint {
    name: string;
    value: number;
}

interface AdminChartsProps {
    brandData: ChartDataPoint[];
    categoryData: ChartDataPoint[];
    priceData: ChartDataPoint[];
}

const COLORS = ['#0ea5e9', '#0284c7', '#0369a1', '#e0f2fe', '#bae6fd'];

export default function AdminCharts({ brandData, categoryData, priceData }: AdminChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Brands Chart */}
            <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Top Brands by Product Count</CardTitle>
                    <CardDescription>Distribution of products across leading manufacturers</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={brandData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                    tick={{ fill: '#6b7280' }}
                                    height={50}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                    tick={{ fill: '#6b7280' }}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                    <CardDescription>Top 5 Categories by volume</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex flex-col p-6">
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={2} stroke="#fff" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mt-6 shrink-0">
                        {categoryData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="text-muted-foreground">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Price Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle>Price Range Distribution</CardTitle>
                    <CardDescription>Product counts by price tier</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={priceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                    tick={{ fill: '#6b7280' }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                    tick={{ fill: '#6b7280' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
