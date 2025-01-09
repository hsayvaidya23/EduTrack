import { useState, useEffect } from 'react';
import { Layout } from '@/components/shared/Layout';
import { z } from 'zod';
import { DataTable, Column } from '@/components/shared/DataTable';
import { DynamicForm } from '@/components/shared/DynamicForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { getStudents, createStudent} from '@/api/student';
import { useAuth } from '@/components/AuthProvider';
import { Student } from '@/types/student';
import { useNavigate } from 'react-router-dom';

import { getClasses } from '@/api/class';

const studentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    gender: z.string().min(1, "Gender is required"),
    dob: z.string().min(1, "Date of birth is required"),
    contactDetails: z.string().min(1, "Contact details are required"),
    feesPaid: z.string().transform((val) => Number(val)),
    className: z.string().min(1, "Class is required")
});

type StudentFormData = z.infer<typeof studentSchema>;

const columns: Column[] = [
    { key: 'name', label: 'Name' },
    { key: 'gender', label: 'Gender' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'contactDetails', label: 'Contact Details' },
    { key: 'feesPaid', label: 'Fees Paid' },
    { key: 'className', label: 'Class' }
];



const Students = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [classes, setClasses] = useState<{ value: string; label: string }[]>([]); // State for classes
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { authToken, currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!authToken) {
                setError('Authentication required');
                setLoading(false);
                return;
            }

            try {
                // Fetch students
                const studentData = await getStudents(authToken);
                setStudents(studentData);

                // Fetch classes
                const classData = await getClasses(authToken);
                setClasses(classData);

                setError(null);
            } catch (err) {
                setError('Failed to fetch data. Please try again later.');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [authToken]);


    const handleSubmit = async (formData: StudentFormData) => {
        if (!authToken) {
            setError('Authentication required');
            return;
        }

        try {
            const studentData: Omit<Student, 'id'> = {
                name: formData.name,
                gender: formData.gender,
                dob: new Date(formData.dob),
                contactDetails: formData.contactDetails,
                feesPaid: Number(formData.feesPaid),
                class: formData.className // Match the backend's expected field name
            };
            const newStudent = await createStudent(studentData, authToken);
            setStudents(prevStudents => [...prevStudents, newStudent]);
            setIsDialogOpen(false);
            setError(null);
        } catch (err: any) {
            if (err.response) {
                console.error('Backend error:', err.response.data);
                setError(`Failed to add student: ${err.response.data.message || 'Unknown error'}`);
            } else {
                setError('Failed to add student. Please try again.');
            }
            console.error('Error adding student:', err);
        }
    };

    const formFields = [
        {
            name: 'name',
            label: 'Name',
            type: 'text' as const,
            validation: studentSchema.shape.name
        },
        {
            name: 'gender',
            label: 'Gender',
            type: 'select' as const,
            options: [
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
            ],
            validation: studentSchema.shape.gender
        },
        {
            name: 'dob',
            label: 'Date of Birth',
            type: 'date' as const,
            validation: studentSchema.shape.dob
        },
        {
            name: 'contactDetails',
            label: 'Contact Details',
            type: 'text' as const,
            validation: studentSchema.shape.contactDetails
        },
        {
            name: 'feesPaid',
            label: 'Fees Paid',
            type: 'number' as const,
            validation: studentSchema.shape.feesPaid
        },
        {
            name: 'className',
            label: 'Class',
            type: 'select' as const,
            options: classes,
            validation: studentSchema.shape.className
        },
    ];

    return (
        <Layout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Student Management</h1>
                    {currentUser?.role === 'student' && (
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
                        data={students}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Students;