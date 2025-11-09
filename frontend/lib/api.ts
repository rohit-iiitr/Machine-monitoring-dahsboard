import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  signup: async (email: string, password: string) => {
    const response = await api.post('/auth/signup', { email, password });
    return response.data;
  },
};

export const machinesAPI = {
  getAll: async () => {
    const response = await api.get('/machines');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/machines/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/machines', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/machines/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/machines/${id}`);
    return response.data;
  },
};

