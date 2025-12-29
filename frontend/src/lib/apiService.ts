import apiClient from './api';

export interface Project {
  id: number;
  name: string;
  key: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Sprint {
  id: number;
  project_id: number;
  name: string;
  goal?: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

export interface Task {
  id: number;
  project_id: number;
  sprint_id?: number;
  title: string;
  description?: string;
  task_type: string;
  status: string;
  priority: string;
  story_points?: number;
  assigned_to?: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  due_date?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Comment {
  id: number;
  task_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: number;
  task_id: number;
  user_id: number;
  action: string;
  field_changed?: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
}

export const projectAPI = {
  getAll: () => apiClient.get<Project[]>('/api/projects'),
  getById: (id: number) => apiClient.get<Project>(`/api/projects/${id}`),
  create: (data: Partial<Project>) => apiClient.post<Project>('/api/projects', data),
  update: (id: number, data: Partial<Project>) => apiClient.put<Project>(`/api/projects/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/projects/${id}`),
};

export const sprintAPI = {
  getAll: (projectId?: number) => {
    const params = projectId ? { project_id: projectId } : {};
    return apiClient.get<Sprint[]>('/api/sprints', { params });
  },
  getById: (id: number) => apiClient.get<Sprint>(`/api/sprints/${id}`),
  create: (data: Partial<Sprint>) => apiClient.post<Sprint>('/api/sprints', data),
  update: (id: number, data: Partial<Sprint>) => apiClient.put<Sprint>(`/api/sprints/${id}`, data),
  start: (id: number) => apiClient.post<Sprint>(`/api/sprints/${id}/start`),
  complete: (id: number) => apiClient.post<Sprint>(`/api/sprints/${id}/complete`),
};

export const taskAPI = {
  getAll: (filters?: { project_id?: number; sprint_id?: number; status?: string; assigned_to?: number }) => {
    return apiClient.get<Task[]>('/api/tasks', { params: filters });
  },
  getById: (id: number) => apiClient.get<Task>(`/api/tasks/${id}`),
  create: (data: Partial<Task>) => apiClient.post<Task>('/api/tasks', data),
  update: (id: number, data: Partial<Task>) => apiClient.put<Task>(`/api/tasks/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/tasks/${id}`),
  move: (id: number, data: { status?: string; sprint_id?: number }) => 
    apiClient.put<Task>(`/api/tasks/${id}/move`, data),
  assign: (id: number, userId: number) => 
    apiClient.put<Task>(`/api/tasks/${id}/assign`, { user_id: userId }),
  getComments: (id: number) => apiClient.get<Comment[]>(`/api/tasks/${id}/comments`),
  addComment: (id: number, content: string, userId: number) => 
    apiClient.post<Comment>(`/api/tasks/${id}/comments`, { content, user_id: userId }),
  getActivity: (id: number) => apiClient.get<ActivityLog[]>(`/api/tasks/${id}/activity`),
};

export const userAPI = {
  getAll: () => apiClient.get<User[]>('/api/users'),
  getById: (id: number) => apiClient.get<User>(`/api/users/${id}`),
};