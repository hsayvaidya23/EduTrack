import { DataTable } from '@/components/shared/DataTable'
import { DynamicForm } from '@/components/shared/DynamicForm'
import { Layout } from '@/components/shared/Layout'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from 'react'
import * as z from 'zod'

// Mock data (replace with actual API calls)
const mockTeachers = [
    { id: 1, name: 'John Doe', gender: 'Male', dateOfBirth: '1980-01-01', email: 'john@example.com', phone: '1234567890', salary: 50000, assignedClass: 'Class 1A' },
    { id: 2, name: 'Jane Smith', gender: 'Female', dateOfBirth: '1985-05-15', email: 'jane@example.com', phone: '0987654321', salary: 55000, assignedClass: 'Class 2B' },
]

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'gender', label: 'Gender' },
    { key: 'dateOfBirth', label: 'Date of Birth' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'salary', label: 'Salary' },
    { key: 'assignedClass', label: 'Assigned Class' },
]

const formFields = [
    { name: 'name', label: 'Name', type: 'text', validation: z.string().min(1) },
    {
        name: 'gender', label: 'Gender', type: 'select', options: [
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
        ]
    },
    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', validation: z.string().min(1) },
    { name: 'email', label: 'Email', type: 'text', validation: z.string().email() },
    { name: 'phone', label: 'Phone', type: 'text', validation: z.string().min(10) },
    { name: 'salary', label: 'Salary', type: 'number', validation: z.number().min(0) },
    {
        name: 'assignedClass', label: 'Assigned Class', type: 'select', options: [
            { value: 'Class 1A', label: 'Class 1A' },
            { value: 'Class 2B', label: 'Class 2B' },
        ]
    },
]


const Teachers = () => {
    const [teachers, setTeachers] = useState(mockTeachers)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleSubmit = (data: any) => {
        // Add API call here to create/update teacher
        setTeachers([...teachers, { ...data, id: teachers.length + 1 }])
        setIsDialogOpen(false)
    }

    return (
        <Layout>
            <div>
                <h1 className="text-2xl font-bold mb-4">Teacher Management</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="mb-4">Add New Teacher</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader >
                            <DialogTitle>Add New Teacher</DialogTitle>
                        </DialogHeader>
                        <DynamicForm
                            fields={formFields.map(field => ({
                                ...field,
                                type: field.type as 'text' | 'number' | 'date' | 'select'
                            }))}
                            onSubmit={handleSubmit}
                        />
                    </DialogContent>
                </Dialog>
                <DataTable columns={columns} data={teachers} />
            </div>
        </Layout>
    )
}

export default Teachers