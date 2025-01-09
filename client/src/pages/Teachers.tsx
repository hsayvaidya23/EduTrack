import { useState, useEffect } from 'react';
import { Layout } from '@/components/shared/Layout';
import { z } from 'zod';
import { DataTable, Column } from '@/components/shared/DataTable';
import { DynamicForm } from '@/components/shared/DynamicForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';

// Define the teacher schema for validation
const teacherSchema = z.object({
    name: z.string().min(1, "Name is required"),
    gender: z.string().min(1, "Gender is required"),
    dateOfBirth: z.string().min(1, "Date of Birth is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    salary: z.string().transform((val) => Number(val)),
    assignedClass: z.string().optional(),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

const columns: Column[] = [
    { key: 'name', label: 'Name' },
    { key: 'gender', label: 'Gender' },
    { key: 'dateOfBirth', label: 'Date of Birth' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'salary', label: 'Salary' },
    { key: 'assignedClass', label: 'Assigned Class' },
];

const formFields = [
    { name: 'name', label: 'Name', type: 'text' as const, validation: teacherSchema.shape.name },
    {
        name: 'gender', label: 'Gender', type: 'select' as const, options: [
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
        ], validation: teacherSchema.shape.gender
    },
    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' as const, validation: teacherSchema.shape.dateOfBirth },
    { name: 'email', label: 'Email', type: 'text' as const, validation: teacherSchema.shape.email },
    { name: 'phone', label: 'Phone', type: 'text' as const, validation: teacherSchema.shape.phone },
    { name: 'salary', label: 'Salary', type: 'number' as const, validation: teacherSchema.shape.salary },
    {
        name: 'assignedClass', label: 'Assigned Class', type: 'select' as const, options: [
            { value: 'Class 1A', label: 'Class 1A' },
            { value: 'Class 2B', label: 'Class 2B' },
        ], validation: teacherSchema.shape.assignedClass
    },
];

// API functions
const getTeachers = async (authToken: string) => {
    const response = await fetch('http://localhost:5000/api/teachers', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (!response.ok) {
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch teachers');
    }

    return response.json();
};

const createTeacher = async (teacherData: TeacherFormData, authToken: string) => {
    const response = await fetch('http://localhost:5000/api/teachers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(teacherData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create teacher');
    }

    return response.json();
};

const Teachers = () => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { authToken, currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeachers = async () => {
            if (!authToken) {
                setError('Authentication required');
                setLoading(false);
                return;
            }

            try {
                const data = await getTeachers(authToken);
                setTeachers(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch teachers. Please try again later.');
                console.error('Error fetching teachers:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, [authToken]);

    const handleSubmit = async (formData: TeacherFormData) => {
        if (!authToken) {
            setError('Authentication required');
            return;
        }

        try {
            const teacherData = {
                ...formData,
                salary: Number(formData.salary),
            };

            const newTeacher = await createTeacher(teacherData, authToken);
            setTeachers(prevTeachers => [...prevTeachers, newTeacher]);
            setIsDialogOpen(false);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to add teacher. Please try again.');
            console.error('Error adding teacher:', err);
        }
    };

    const handleRowClick = (teacher: any) => {
        navigate(`/teachers/${teacher.id}/details`);
    };

    return (
        <Layout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Teacher Management</h1>

                    {currentUser?.role === 'teacher' && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>Add New Student</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Student</DialogTitle>
                                </DialogHeader>
                                <DynamicForm
                                    fields={formFields}
                                    onSubmit={handleSubmit}
                                />
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {loading && (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {!loading && !error && (
                    <DataTable
                        columns={columns}
                        data={teachers}
                        onRowClick={handleRowClick}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Teachers;