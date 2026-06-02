import api from "./axios";
import type { Organization, OrganizationMember, OrganizationRole } from "../types";

export const organizationsApi = {
  list: () => api.get<Organization[]>("/organizations"),

  getById: (id: string) => api.get<Organization>(`/organizations/${id}`),

  create: (data: { name: string }) => api.post<Organization>("/organizations", data),

  addMember: (orgId: string, data: { email: string; role?: OrganizationRole }) =>
    api.post<OrganizationMember>(`/organizations/${orgId}/members`, data),

  removeMember: (orgId: string, userId: string) =>
    api.delete(`/organizations/${orgId}/members/${userId}`),
};
