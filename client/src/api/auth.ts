import axios from 'axios';
import { AuthResponse, User } from '../types/user';

const API_URL = 'http://localhost:5000/api/auth';

// Login user
export const login = async (email: string, password: string, role: User['role']): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, { email, password, role });
    return response.data;
};

// Register user
export const register = async (userData: Omit<User, 'id'>): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, userData);
    return response.data;
};