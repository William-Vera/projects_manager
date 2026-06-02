import prisma from "../config/prisma.js";

export const getDashboardMetrics = async (userId: string) => {
  const projects = await prisma.projects.findMany({
    where: {
      OR: [
        { duenoId: userId },
        {
          organization: {
            members: {
              some: { userId },
            },
          },
        },
      ],
    },
    include: {
      tasks: true,
    },
  });

  const totalProjects = projects.length;

  const projectStatusCounts = {
    PLANIFICADO: 0,
    EN_CURSO: 0,
    COMPLETADO: 0,
    CANCELADO: 0,
  };

  let totalTasks = 0;
  const taskStatusCounts = {
    PENDIENTE: 0,
    EN_PROGRESO: 0,
    COMPLETADA: 0,
  };

  projects.forEach((proj) => {
    projectStatusCounts[proj.status]++;
    proj.tasks.forEach((task) => {
      totalTasks++;
      taskStatusCounts[task.status]++;
    });
  });

  const assignedTasks = await prisma.task.findMany({
    where: { assignedToId: userId },
  });

  const totalAssignedTasks = assignedTasks.length;
  const assignedTaskStatusCounts = {
    PENDIENTE: 0,
    EN_PROGRESO: 0,
    COMPLETADA: 0,
  };

  assignedTasks.forEach((task) => {
    assignedTaskStatusCounts[task.status]++;
  });

  return {
    projects: {
      total: totalProjects,
      byStatus: projectStatusCounts,
    },
    tasks: {
      total: totalTasks,
      byStatus: taskStatusCounts,
    },
    assignedTasks: {
      total: totalAssignedTasks,
      byStatus: assignedTaskStatusCounts,
    },
  };
};
