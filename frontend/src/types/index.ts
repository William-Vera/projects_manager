export type ProjectStatus =
  | "PLANIFICADO"
  | "EN_CURSO"
  | "COMPLETADO"
  | "CANCELADO";

export type TaskStatus = "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA";

export type OrganizationRole = "OWNER" | "ADMIN" | "MEMBER";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface JwtProfile {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  duenoId: string;
  organizationId: string | null;
  dueno?: Pick<User, "id" | "name" | "email">;
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  assignedToId: string | null;
  assignedTo?: Pick<User, "id" | "name" | "email"> | null;
  project?: Pick<Project, "id" | "name">;
}

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner?: Pick<User, "id" | "name" | "email">;
  members?: OrganizationMember[];
  projects?: Project[];
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: OrganizationRole;
  user?: Pick<User, "id" | "name" | "email">;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  userId: string;
}

export interface DashboardMetrics {
  projects: {
    total: number;
    byStatus: Record<ProjectStatus, number>;
  };
  tasks: {
    total: number;
    byStatus: Record<TaskStatus, number>;
  };
  assignedTasks: {
    total: number;
    byStatus: Record<TaskStatus, number>;
  };
}

export interface ApiError {
  message: string;
}
