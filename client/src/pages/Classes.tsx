import { useState, useEffect } from 'react';
import { Layout } from '@/components/shared/Layout';
import { z } from 'zod';
import { DataTable, Column } from '@/components/shared/DataTable';
import { DynamicForm } from '@/components/shared/DynamicForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Class } from '@/types/class';


// Define the class schema for validation
const classSchema = z.object({
    name: z.string().min(1, "Class name is required"),
    year: z.string().transform((val) => Number(val)), 
    teacher: z.string().optional(),
    studentFees: z.string().transform((val) => Number(val)),
});

type ClassFormData = z.infer<typeof classSchema>;

const columns: Column[] = [
    { key: 'className', label: 'Class Name' },
    { key: 'year', label: 'Year' },
    { key: 'teacher', label: 'Teacher' },
    { key: 'studentFees', label: 'Student Fees' },
];

const formFields = [
    {
        name: 'name',
        label: 'Class Name',
        type: 'text' as const,
        validation: classSchema.shape.name
    },
    {
        name: 'year',
        label: 'Year',
        type: 'number' as const,
        validation: classSchema.shape.year,
        min: new Date().getFullYear()
    },
    {
        name: 'teacher',
        label: 'Teacher',
        type: 'select' as const,
        options: [
            { value: 'John Doe', label: 'John Doe' },
            { value: 'Jane Smith', label: 'Jane Smith' },
        ],
        validation: classSchema.shape.teacher
    },
    {
        name: 'studentFees',
        label: 'Student Fees',
        type: 'number' as const,
        validation: classSchema.shape.studentFees,
        min: 0
    },
];

// API functions
const getClasses = async (authToken: string): Promise<Class[]> => {
    const response = await fetch('http://localhost:5000/api/classes', {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch classes');
        } else {
            const errorText = await response.text();
            console.error("Non-JSON response:", errorText);
            throw new Error('Unexpected server response');
        }
    }

    return response.json();
};

const createClass = async (classData: Omit<Class, 'id' | 'studentCount'>, authToken: string): Promise<Class> => {
    const response = await fetch('http://localhost:5000/api/classes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(classData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create class');
    }

    return response.json();
};


const Classes = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { authToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            if (!authToken) {
                setError('Authentication required');
                setLoading(false);
                return;
            }

            try {
                const data = await getClasses(authToken);
                setClasses(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch classes. Please try again later.');
                console.error('Error fetching classes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [authToken]);

    const handleSubmit = async (formData: ClassFormData) => {
        if (!authToken) {
            setError('Authentication required');
            return;
        }

        try {
            const classData: any = {
                name: formData.name,
                year: Number(formData.year),
                teacher: formData.teacher,
                studentFees: Number(formData.studentFees),
            };

            const newClass = await createClass(classData, authToken);
            setClasses(prevClasses => [...prevClasses, newClass]);
            setIsDialogOpen(false);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to add class. Please try again.');
            console.error('Error adding class:', err);
        }
    };

    const handleRowClick = (classData: Class) => {
        navigate(`/classes/${classData.id}/analytics`);
    };

    return (
        <Layout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Class Management</h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>Add New Class</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Class</DialogTitle>
                            </DialogHeader>
                            <DynamicForm
                                fields={formFields}
                                onSubmit={handleSubmit}
                                schema={classSchema}
                            />
                        </DialogContent>
                    </Dialog>
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
                        data={classes}
                        onRowClick={handleRowClick}
                        // className="w-full"
                    />
                )}
            </div>
        </Layout>
    );
};
export default Classes;