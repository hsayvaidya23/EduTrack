import React, { useState } from 'react'
import { Layout } from '@/components/shared/Layout'
import { z } from 'zod'
import { DataTable } from '@/components/shared/DataTable'
import { DynamicForm } from '@/components/shared/DynamicForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'

const mockStudents = [
    { id: 1, name: 'Alice Johnson', gender: 'Female', dateOfBirth: '2005-03-15', email: 'alice@example.com', phone: '1234567890', feesPaid: 1000, class: 'Class 1A' },
    { id: 2, name: 'Bob Williams', gender: 'Male', dateOfBirth: '2006-07-22', email: 'bob@example.com', phone: '0987654321', feesPaid: 1200, class: 'Class 2B' },
]

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'gender', label: 'Gender' },
    { key: 'dateOfBirth', label: 'Date of Birth' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'feesPaid', label: 'Fees Paid' },
    { key: 'class', label: 'Class' },
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
    { name: 'feesPaid', label: 'Fees Paid', type: 'number', validation: z.number().min(0) },
    {
        name: 'class', label: 'Class', type: 'select', options: [
            { value: 'Class 1A', label: 'Class 1A' },
            { value: 'Class 2B', label: 'Class 2B' },
        ]
    },
]


const Students = () => {
    const [students, setStudents] = useState(mockStudents)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleSubmit = (data: any) => {
        // Add API call here to create/update student
        setStudents([...students, { ...data, id: students.length + 1 }])
        setIsDialogOpen(false)
    }
    return (
        <Layout>
            <div>
                <h1 className="text-2xl font-bold mb-4">Student Management</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="mb-4">Add New Student</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Student</DialogTitle>
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
                <DataTable columns={columns} data={students} />
            </div>
        </Layout>
    )
}

export default Students