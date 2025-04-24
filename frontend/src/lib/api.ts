import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Auth Services
export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  register: async (username: string, password: string, email: string) => {
    const response = await api.post('/auth/register', {
      username,
      password,
      email,
    });
    return response.data;
  },
};

// Project Types
export interface Project {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectRequest {
  name: string;
  description?: string | null;
}

// Project Services
export const projectService = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
  },
  getById: async (id: number): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  create: async (project: ProjectRequest): Promise<Project> => {
    const response = await api.post('/projects', project);
    return response.data;
  },
  update: async (id: number, project: ProjectRequest): Promise<Project> => {
    const response = await api.put(`/projects/${id}`, project);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

// Service Order Types
export interface ServiceOrder {
  id: number;
  name: string;
  category: string;
  description: string | null;
  project_id: number;
  is_approved: boolean;
  created_date: string;
  updated_date: string;
  project_name?: string;
}

export interface ServiceOrderRequest {
  name: string;
  category: string;
  description?: string | null;
  project_id: number;
  is_approved?: boolean;
}

// Service Order Services
export const serviceOrderService = {
  getAll: async (projectId?: number): Promise<ServiceOrder[]> => {
    const url = projectId
      ? `/service-orders?project_id=${projectId}`
      : '/service-orders';
    const response = await api.get(url);
    return response.data;
  },
  getById: async (id: number): Promise<ServiceOrder> => {
    const response = await api.get(`/service-orders/${id}`);
    return response.data;
  },
  create: async (serviceOrder: ServiceOrderRequest): Promise<ServiceOrder> => {
    const response = await api.post('/service-orders', serviceOrder);
    return response.data;
  },
  update: async (
    id: number,
    serviceOrder: ServiceOrderRequest,
  ): Promise<ServiceOrder> => {
    const response = await api.put(`/service-orders/${id}`, serviceOrder);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/service-orders/${id}`);
  },
};

export default api;
