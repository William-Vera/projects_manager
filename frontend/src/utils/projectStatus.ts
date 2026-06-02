import type { Project, ProjectStatus } from "../types";

export function isProjectOverdue(project: {
  endDate: string | null;
  status: ProjectStatus;
}): boolean {
  if (!project.endDate) return false;
  if (project.status === "COMPLETADO" || project.status === "CANCELADO") {
    return false;
  }
  return new Date(project.endDate).getTime() < Date.now();
}

export function formatProjectStatus(status: ProjectStatus): string {
  const map: Record<ProjectStatus, string> = {
    PLANIFICADO: "Planificado",
    EN_CURSO: "En curso",
    COMPLETADO: "Completado",
    CANCELADO: "Cancelado",
  };
  return map[status];
}

export function formatTaskStatus(status: string): string {
  const map: Record<string, string> = {
    PENDIENTE: "Pendiente",
    EN_PROGRESO: "En progreso",
    COMPLETADA: "Completada",
  };
  return map[status] ?? status;
}

export function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeTime(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Ayer";
  return `Hace ${days} días`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function projectProgress(project: Project): number {
  const tasks = project.tasks ?? [];
  if (tasks.length === 0) {
    if (project.status === "COMPLETADO") return 100;
    if (project.status === "EN_CURSO") return 50;
    return 0;
  }
  const done = tasks.filter((t) => t.status === "COMPLETADA").length;
  return Math.round((done / tasks.length) * 100);
}
