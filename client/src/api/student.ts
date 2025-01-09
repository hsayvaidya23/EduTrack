import axios from 'axios';
import { Student } from '../types/student';

const API_URL = 'http://localhost:5000/api/students';

export const getClasses = async (token: string): Promise<{ value: string; label: string }[]> => {
  const response = await axios.get<{ id: string; name: string }[]>(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Transform the response into the format expected by the dropdown
  return response.data.map((cls) => ({
    value: cls.id, // Use the class ID as the value
    label: cls.name, // Use the class name as the label
  }));
};


// Get all students
export const getStudents = async (token: string): Promise<Student[]> => {
  const response = await axios.get<Student[]>(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create a student
export const createStudent = async (studentData: Omit<Student, 'id'>, token: string): Promise<Student> => {
  const response = await axios.post<Student>(API_URL, studentData, {
      headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update a student
export const updateStudent = async (id: string, studentData: Partial<Student>, token: string): Promise<Student> => {
  const response = await axios.put<Student>(`${API_URL}/${id}`, studentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a student
export const deleteStudent = async (id: string, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};