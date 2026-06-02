import type { Projects, ProjectStatus } from "../generated/prisma/index.js";
export type ProjectdDisplayStatus = ProjectStatus | "OVERDUE";
export declare function isProjectOverdue(project: {
    endDate: Date | null;
    status: ProjectStatus;
}): boolean;
export declare function getDisplayStatus(project: {
    endDate: Date | null;
    status: ProjectStatus;
}): ProjectdDisplayStatus;
export declare function toProjectResponse(project: Projects): {
    isOverdue: boolean;
    displayStatus: ProjectdDisplayStatus;
    notFinishedOnTime: boolean;
    id: string;
    name: string;
    createdAt: Date;
    status: import("../generated/prisma/index.js").$Enums.ProjectStatus;
    organizationId: string | null;
    description: string;
    startDate: Date | null;
    endDate: Date | null;
    duenoId: string;
};
//# sourceMappingURL=project-status.d.ts.map