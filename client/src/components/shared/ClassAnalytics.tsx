import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/shared/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { getClassDetails } from '@/api/class';
import { Student } from '@/types/student';
import { useAuth } from '@/components/AuthProvider';

const ClassAnalytics = () => {
    const { classId } = useParams<{ classId: string }>();
    const [classDetails, setClassDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                if (!classId || !authToken) {
                    throw new Error('Class ID or authentication token is missing');
                }
                const data = await getClassDetails(classId, authToken);
                setClassDetails(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch class details. Please try again later.');
                console.error('Error fetching class details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchClassDetails();
    }, [classId, authToken]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!classDetails) {
        return <div>Class not found.</div>;
    }

    const genderData = [
        { gender: 'Male', count: classDetails.students.filter((student: Student) => student.gender === 'Male').length },
        { gender: 'Female', count: classDetails.students.filter((student: Student) => student.gender === 'Female').length },
    ];

    return (
        <Layout>
            <div className="space-y-4 p-4 max-w-[1920px] mx-auto">
                <h1 className="text-xl md:text-2xl font-bold">Class Analytics: {classDetails.name}</h1>
                <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-lg md:text-xl">Class Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p><strong>Name:</strong> {classDetails.name}</p>
                                <p><strong>Year:</strong> {classDetails.year}</p>
                                <p><strong>Teacher:</strong> {classDetails.teacher?.name || 'N/A'}</p>
                                <p><strong>Number of Students:</strong> {classDetails.students.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-lg md:text-xl">Gender Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={{
                                    Male: { label: "Male", color: "hsl(240, 100%, 50%)" },
                                    Female: { label: "Female", color: "hsl(300, 100%, 50%)" },
                                }}
                                className="h-[250px] md:h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={genderData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="gender" />
                                        <YAxis />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Legend />
                                        <Bar dataKey="count" fill="var(--color-Male)" />
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

export default ClassAnalytics;