import axios from 'axios';
import { Teacher } from '../types/teacher';

const API_URL = 'http://localhost:5000/api/teachers';

// Get all teachers
export const getTeachers = async (token: string): Promise<Teacher[]> => {
  const response = await axios.get<Teacher[]>(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create a teacher
export const createTeacher = async (teacherData: Omit<Teacher, 'id'>, token: string): Promise<Teacher> => {
  const response = await axios.post<Teacher>(API_URL, teacherData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update a teacher
export const updateTeacher = async (id: string, teacherData: Partial<Teacher>, token: string): Promise<Teacher> => {
  const response = await axios.put<Teacher>(`${API_URL}/${id}`, teacherData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a teacher
export const deleteTeacher = async (id: string, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};