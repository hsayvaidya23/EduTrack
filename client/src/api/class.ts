import axios from 'axios';
import { Class } from '../types/class';

const API_URL = 'http://localhost:5000/api/classes';

// Get all classes
export const getClasses = async (token: string): Promise<Class[]> => {
  const response = await axios.get<Class[]>(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create a class
export const createClass = async (classData: Omit<Class, 'id'>, token: string): Promise<Class> => {
  const response = await axios.post<Class>(API_URL, classData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update a class
export const updateClass = async (id: string, classData: Partial<Class>, token: string): Promise<Class> => {
  const response = await axios.put<Class>(`${API_URL}/${id}`, classData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a class
export const deleteClass = async (id: string, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};