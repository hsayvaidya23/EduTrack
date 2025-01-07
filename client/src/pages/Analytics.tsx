import { useState } from 'react'
import { Layout } from '@/components/shared/Layout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'

// Mock data (replace with actual API calls)
const mockMonthlyData = [
    { month: 'Jan', expenses: 50000, income: 75000 },
    { month: 'Feb', expenses: 55000, income: 80000 },
    { month: 'Mar', expenses: 52000, income: 78000 },
    { month: 'Apr', expenses: 58000, income: 82000 },
    { month: 'May', expenses: 53000, income: 79000 },
    { month: 'Jun', expenses: 54000, income: 81000 },
]

const mockYearlyData = [
    { year: '2020', expenses: 600000, income: 900000 },
    { year: '2021', expenses: 650000, income: 950000 },
    { year: '2022', expenses: 700000, income: 1000000 },
    { year: '2023', expenses: 750000, income: 1100000 },
]

const Analytics = () => {
    const [viewType, setViewType] = useState('monthly')
    const [selectedYear, setSelectedYear] = useState('2023')
    const [selectedMonth, setSelectedMonth] = useState('Jun')

    const data = viewType === 'monthly' ? mockMonthlyData : mockYearlyData
    return (
        <Layout>
            <div className="space-y-4 p-4 max-w-[1920px] mx-auto">
                <h1 className="text-xl md:text-2xl font-bold">Analytics</h1>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Select value={viewType} onValueChange={setViewType}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Select view" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                    {viewType === 'monthly' && (
                        <>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2023">2023</SelectItem>
                                    <SelectItem value="2022">2022</SelectItem>
                                    <SelectItem value="2021">2021</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockMonthlyData.map(item => (
                                        <SelectItem key={item.month} value={item.month}>{item.month}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    )}
                    {viewType === 'yearly' && (
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockYearlyData.map(item => (
                                    <SelectItem key={item.year} value={item.year}>{item.year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-lg md:text-xl">Expenses vs Income</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={{
                                    expenses: {
                                        label: "Expenses",
                                        color: "hsl(0, 100%, 50%)", // Red
                                    },
                                    income: {
                                        label: "Income",
                                        color: "hsl(120, 100%, 25%)", // Green
                                    },
                                }}
                                className="h-[250px] md:h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey={viewType === 'monthly' ? 'month' : 'year'} />
                                        <YAxis />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Legend />
                                        <Bar dataKey="expenses" fill="var(--color-expenses)" />
                                        <Bar dataKey="income" fill="var(--color-income)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-lg md:text-xl">Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-base md:text-lg font-medium">Total Expenses</h3>
                                    <p className="text-xl md:text-2xl font-bold text-red-500">
                                        ${data.reduce((sum, item) => sum + item.expenses, 0).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-medium">Total Income</h3>
                                    <p className="text-xl md:text-2xl font-bold text-green-500">
                                        ${data.reduce((sum, item) => sum + item.income, 0).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-medium">Net Profit</h3>
                                    <p className="text-xl md:text-2xl font-bold text-blue-500">
                                        ${(data.reduce((sum, item) => sum + item.income, 0) -
                                            data.reduce((sum, item) => sum + item.expenses, 0)).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    )
}

export default Analytics