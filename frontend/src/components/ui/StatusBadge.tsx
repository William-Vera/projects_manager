import type { ProjectStatus, TaskStatus } from "../../types";
import { formatProjectStatus, formatTaskStatus } from "../../utils/projectStatus";

const projectColors: Record<ProjectStatus, string> = {
  PLANIFICADO: "bg-surface-variant text-on-surface-variant",
  EN_CURSO: "bg-secondary/10 text-secondary",
  COMPLETADO: "bg-green-100 text-green-700",
  CANCELADO: "bg-on-surface-variant/10 text-on-surface-variant",
};

const taskColors: Record<TaskStatus, string> = {
  PENDIENTE: "bg-surface-variant text-on-surface-variant",
  EN_PROGRESO: "bg-primary-container/20 text-primary",
  COMPLETADA: "bg-green-100 text-green-700",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${projectColors[status]}`}
    >
      {formatProjectStatus(status)}
    </span>
  );
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${taskColors[status]}`}
    >
      {formatTaskStatus(status)}
    </span>
  );
}

export function OverdueBadge() {
  return (
    <span className="bg-error/10 text-error w-fit px-1 rounded text-[10px] font-bold uppercase">
      Vencido
    </span>
  );
}
