import type { Projects, ProjectStatus } from "../generated/prisma/index.js"

export type ProjectdDisplayStatus = ProjectStatus | "OVERDUE";

export function isProjectOverdue(project: {
    endDate: Date | null;
    status: ProjectStatus;
}): boolean {
    if (!project.endDate) return false;
    if (project.status === "COMPLETADO" || project.status === "CANCELADO") {
        return false;
    }
    return project.endDate.getTime() < Date.now();
}

export function getDisplayStatus(project: {
    endDate: Date | null;
    status: ProjectStatus;
}): ProjectdDisplayStatus {
    if (isProjectOverdue(project)) return "OVERDUE";
    return project.status;
}
export function toProjectResponse(project: Projects) {
    const overdue = isProjectOverdue(project);
    return {
        ...project,
        isOverdue: overdue,
        displayStatus: getDisplayStatus(project),
        notFinishedOnTime: overdue,
    };
}