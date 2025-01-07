import React, { useState } from 'react'
import { Layout } from '@/components/shared/Layout'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import * as z from 'zod'
import { DynamicForm } from '@/components/shared/DynamicForm'
import { DataTable } from '@/components/shared/DataTable'

const mockClasses = [
  { id: 1, name: 'Class 1A', year: 2023, teacher: 'John Doe', studentFees: 1000, studentCount: 25 },
  { id: 2, name: 'Class 2B', year: 2023, teacher: 'Jane Smith', studentFees: 1200, studentCount: 22 },
]

const columns = [
  { key: 'name', label: 'Class Name' },
  { key: 'year', label: 'Year' },
  { key: 'teacher', label: 'Teacher' },
  { key: 'studentFees', label: 'Student Fees' },
  { key: 'studentCount', label: 'Student Count' },
]

const formFields = [
  { name: 'name', label: 'Class Name', type: 'text', validation: z.string().min(1) },
  { name: 'year', label: 'Year', type: 'number', validation: z.number().min(2023) },
  { name: 'teacher', label: 'Teacher', type: 'select', options: [
    { value: 'John Doe', label: 'John Doe' },
    { value: 'Jane Smith', label: 'Jane Smith' },
  ]},
  { name: 'studentFees', label: 'Student Fees', type: 'number', validation: z.number().min(0) },
]


const Classes = () => {
  const [classes, setClasses] = useState(mockClasses)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = (data: any) => {
    // Add API call here to create/update class
    setClasses([...classes, { ...data, id: classes.length + 1, studentCount: 0 }])
    setIsDialogOpen(false)
  }

  const handleRowClick = (classData: any) => {
    // Navigate to class analytics page
    console.log('Navigating to class analytics for:', classData)
  }

  return (
    <Layout>
      <div>
      <h1 className="text-2xl font-bold mb-4">Class Management</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Class</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
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
      <DataTable columns={columns} data={classes} onRowClick={handleRowClick} />
    </div>
    </Layout>
  )
}

export default Classes