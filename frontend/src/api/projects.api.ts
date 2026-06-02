import api from "./axios";
import type { Project, ProjectStatus } from "../types";

export const projectsApi = {
  list: () => api.get<Project[]>("/projects"),

  getById: (id: string) => api.get<Project>(`/projects/${id}`),

  create: (data: {
    name: string;
    description: string;
    status?: ProjectStatus;
    startDate?: string | null;
    endDate?: string | null;
    organizationId?: string | null;
  }) => api.post<Project>("/projects", data),

  update: (
    id: string,
    data: Partial<{
      name: string;
      description: string;
      status: ProjectStatus;
      startDate: string | null;
      endDate: string | null;
    }>
  ) => api.put<Project>(`/projects/${id}`, data),

  remove: (id: string) => api.delete(`/projects/${id}`),
};
