import { useState, useEffect } from 'react';
import { Layout } from '@/components/shared/Layout';
import { z } from 'zod';
import { DataTable, Column } from '@/components/shared/DataTable';
import { DynamicForm } from '@/components/shared/DynamicForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { getTeachers, createTeacher } from '@/api/teacher';
import { getClasses } from '@/api/class';
import { Teacher } from '@/types/teacher';

// Define the teacher schema for validation
const teacherSchema = z.object({
    name: z.string().min(1, "Name is required"),
    gender: z.string().min(1, "Gender is required"),
    dob: z.string().min(1, "Date of Birth is required"), // Use `dob` instead of `dateOfBirth`
    contactDetails: z.string().min(1, "Contact details are required"),
    salary: z.string().transform((val) => Number(val)),
    assignedClass: z.string().optional(),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

const columns: Column[] = [
    { key: 'name', label: 'Name' },
    { key: 'gender', label: 'Gender' },
    { key: 'contactDetails', label: 'Contact Details' }, // Updated to match schema
    { key: 'salary', label: 'Salary' },
    { key: 'assignedClass', label: 'Assigned Class' },
];



const Teachers = () => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [classes, setClasses] = useState<{ value: string; label: string }[]>([]);
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

                const classData = await getClasses(authToken);
                setClasses(classData);
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

    const formFields = [
        { name: 'name', label: 'Name', type: 'text' as const, validation: teacherSchema.shape.name },
        {
            name: 'gender', label: 'Gender', type: 'select' as const, options: [
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
            ], validation: teacherSchema.shape.gender
        },
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' as const, validation: teacherSchema.shape.dob },
        { name: 'contactDetails', label: 'Contact Details', type: 'text' as const, validation: teacherSchema.shape.contactDetails }, // Added contactDetails
        { name: 'salary', label: 'Salary', type: 'number' as const, validation: teacherSchema.shape.salary },
        {
            name: 'assignedClass', label: 'Assigned Class', type: 'select' as const, options: classes,
            validation: teacherSchema.shape.assignedClass
        },
    ];

    
    const handleSubmit = async (formData: TeacherFormData) => {
        if (!authToken) {
            setError('Authentication required');
            return;
        }
    
        try {
            const teacherData: Omit<Teacher, 'id'> = {
                name: formData.name,
                gender: formData.gender,
                dob: formData.dob, // Use `dob` instead of `dateOfBirth`
                contactDetails: formData.contactDetails,
                salary: Number(formData.salary),
                assignedClass: formData.assignedClass || null, // Use null if no class is assigned
            };
    
            const newTeacher = await createTeacher(teacherData, authToken);
            setTeachers((prevTeachers) => [...prevTeachers, newTeacher]);
            setIsDialogOpen(false);
            setError(null);
        } catch (err: any) {
            if (err.response) {
                console.error('Backend error:', err.response.data);
                setError(`Failed to add teacher: ${err.response.data.message || 'Unknown error'}`);
            } else {
                setError('Failed to add teacher. Please try again.');
            }
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
                                <Button>Add New Teacher</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Teacher</DialogTitle> {/* Fixed title */}
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