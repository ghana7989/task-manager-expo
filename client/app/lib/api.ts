import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://task-manager-expo-production.up.railway.app/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
      status: error.response?.status,
      response: error.response?.data
    });
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
);

export const auth = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  },

  async signup(name: string, email: string, password: string) {
    const response = await api.post('/auth/signup', { name, email, password });
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  },

  async logout() {
    await AsyncStorage.removeItem('token');
  },

  async getToken() {
    return await AsyncStorage.getItem('token');
  }
};

export const tasks = {
  async getAll() {
    console.log('Fetching all tasks');
    const response = await api.get('/tasks');
    return response.data;
  },

  async getOne(id: string) {
    console.log('Fetching task:', id);
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  async create(data: { title: string; description: string }) {
    console.log('Creating task:', data);
    const response = await api.post('/tasks', data);
    return response.data;
  },

  async update(id: string, data: { title?: string; description?: string; completed?: boolean }) {
    console.log('Updating task:', { id, updates: data });
    
    // Ensure we only send defined fields
    const updates = Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
    console.log('Filtered updates:', updates);
    
    const response = await api.put(`/tasks/${id}`, updates);
    return response.data;
  },

  async delete(id: string) {
    console.log('Deleting task:', id);
    await api.delete(`/tasks/${id}`);
  }
};

export default api; 
