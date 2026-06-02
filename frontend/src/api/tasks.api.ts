import api from "./axios";
import type { Task, TaskStatus } from "../types";

export const tasksApi = {
  listByProject: (projectId: string) =>
    api.get<Task[]>(`/projects/${projectId}/tasks`),

  getById: (id: string) => api.get<Task>(`/tasks/${id}`),

  create: (
    projectId: string,
    data: {
      title: string;
      description?: string | null;
      dueDate?: string | null;
      assignedToId?: string | null;
    }
  ) => api.post<Task>(`/projects/${projectId}/tasks`, data),

  update: (
    id: string,
    data: Partial<{
      title: string;
      description: string | null;
      status: TaskStatus;
      dueDate: string | null;
      assignedToId: string | null;
    }>
  ) => api.put<Task>(`/tasks/${id}`, data),

  updateStatus: (id: string, status: TaskStatus) =>
    api.patch<Task>(`/tasks/${id}/status`, { status }),

  assign: (id: string, assignedToId: string | null) =>
    api.patch<Task>(`/tasks/${id}/assign`, { assignedToId }),

  remove: (id: string) => api.delete(`/tasks/${id}`),
};
