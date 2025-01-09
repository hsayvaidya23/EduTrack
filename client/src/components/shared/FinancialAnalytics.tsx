import { useState, useEffect } from 'react';
import { Layout } from '@/components/shared/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { getTeachers } from '@/api/teacher';
import { getClasses } from '@/api/class';

const FinancialAnalytics = () => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const teachersData = await getTeachers();
                const classesData = await getClasses();
                setTeachers(teachersData);
                setClasses(classesData);
                setError(null);
            } catch (err) {
                setError('Failed to fetch data. Please try again later.');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Calculate total teacher salaries
    const totalSalaries = teachers.reduce((sum, teacher) => sum + teacher.salary, 0);

    // Calculate total income from student fees
    const totalFees = classes.reduce((sum, cls) => sum + cls.studentFees * cls.students.length, 0);

    // Prepare data for the financial chart
    const financialData = [
        { category: 'Teacher Salaries', amount: totalSalaries },
        { category: 'Student Fees', amount: totalFees },
    ];

    return (
        <Layout>
            <div className="space-y-4 p-4 max-w-[1920px] mx-auto">
                <h1 className="text-xl md:text-2xl font-bold">Financial Analytics</h1>
                <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-lg md:text-xl">Financial Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p><strong>Total Teacher Salaries:</strong> ${totalSalaries.toLocaleString()}</p>
                                <p><strong>Total Income from Student Fees:</strong> ${totalFees.toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-lg md:text-xl">Financial Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={{
                                    'Teacher Salaries': { label: "Teacher Salaries", color: "hsl(120, 100%, 50%)" }, // Green
                                    'Student Fees': { label: "Student Fees", color: "hsl(60, 100%, 50%)" }, // Yellow
                                }}
                                className="h-[250px] md:h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={financialData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" />
                                        <YAxis />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Legend />
                                        <Bar dataKey="amount" fill="var(--color-Teacher Salaries)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default FinancialAnalytics;