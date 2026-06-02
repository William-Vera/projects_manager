import prisma from "../config/prisma.js";
import { HttpError } from "../errors/http-error.js";
import {
  createTaskSchema,
  updateTaskSchema,
  updateStatusSchema,
  assignTaskSchema,
} from "../validators/task.validators.js";
import { createNotification } from "./notification.service.js";

// Helper: verifica acceso al proyecto y lo devuelve
async function checkProjectAccess(userId: string, projectId: string) {
  const project = await prisma.projects.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new HttpError("Proyecto no encontrado", 404);
  }

  const isOwner = project.duenoId === userId;

  if (!isOwner && project.organizationId) {
    const membership = await prisma.organizationMember.findFirst({
      where: { userId, organizationId: project.organizationId },
    });
    if (!membership) {
      throw new HttpError("No tienes acceso a este proyecto", 403);
    }
  } else if (!isOwner) {
    throw new HttpError("No tienes acceso a este proyecto", 403);
  }

  return project;
}

export const createTask = async (userId: string, projectId: string, data: unknown) => {
  await checkProjectAccess(userId, projectId);
  const parsed = createTaskSchema.parse(data);

  if (parsed.assignedToId) {
    const userExists = await prisma.user.findUnique({
      where: { id: parsed.assignedToId },
    });
    if (!userExists) {
      throw new HttpError("El usuario asignado no existe", 404);
    }
  }

  const task = await prisma.task.create({
    data: {
      title: parsed.title,
      description: parsed.description ?? null,
      dueDate: parsed.dueDate ?? null,
      projectId,
      assignedToId: parsed.assignedToId ?? null,
    },
  });

  if (parsed.assignedToId) {
    await createNotification(parsed.assignedToId, `Te han asignado la tarea: "${task.title}"`);
  }

  return task;
};

export const listProjectTasks = async (userId: string, projectId: string) => {
  await checkProjectAccess(userId, projectId);
  return await prisma.task.findMany({
    where: { projectId },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const getTaskById = async (userId: string, taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: true,
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!task) {
    throw new HttpError("Tarea no encontrada", 404);
  }

  await checkProjectAccess(userId, task.projectId);
  return task;
};

export const updateTask = async (userId: string, taskId: string, data: unknown) => {
  const parsed = updateTaskSchema.parse(data);

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });

  if (!task) {
    throw new HttpError("Tarea no encontrada", 404);
  }

  await checkProjectAccess(userId, task.projectId);

  const isAssigneeChanging =
    parsed.assignedToId !== undefined && parsed.assignedToId !== task.assignedToId;

  if (parsed.assignedToId) {
    const userExists = await prisma.user.findUnique({
      where: { id: parsed.assignedToId },
    });
    if (!userExists) {
      throw new HttpError("El usuario asignado no existe", 404);
    }
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: parsed.title ?? task.title,
      description: parsed.description !== undefined ? (parsed.description ?? null) : task.description,
      status: parsed.status ?? task.status,
      dueDate: parsed.dueDate !== undefined ? (parsed.dueDate ?? null) : task.dueDate,
      assignedToId:
        parsed.assignedToId !== undefined ? (parsed.assignedToId ?? null) : task.assignedToId,
    },
  });

  // Notificar si el asignado cambió
  if (isAssigneeChanging && updatedTask.assignedToId) {
    await createNotification(
      updatedTask.assignedToId,
      `Te han asignado la tarea: "${updatedTask.title}"`
    );
  }

  // Notificar si el estado cambió
  const isStatusChanging = parsed.status !== undefined && parsed.status !== task.status;
  if (isStatusChanging) {
    if (task.project.duenoId !== userId) {
      await createNotification(
        task.project.duenoId,
        `El estado de la tarea "${updatedTask.title}" cambió a ${updatedTask.status}`
      );
    }
    if (updatedTask.assignedToId && updatedTask.assignedToId !== userId) {
      await createNotification(
        updatedTask.assignedToId,
        `El estado de la tarea "${updatedTask.title}" cambió a ${updatedTask.status}`
      );
    }
  }

  return updatedTask;
};

export const updateTaskStatus = async (userId: string, taskId: string, data: unknown) => {
  const { status } = updateStatusSchema.parse(data);
  return await updateTask(userId, taskId, { status });
};

export const assignTask = async (userId: string, taskId: string, data: unknown) => {
  const { assignedToId } = assignTaskSchema.parse(data);
  return await updateTask(userId, taskId, { assignedToId });
};

export const deleteTask = async (userId: string, taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new HttpError("Tarea no encontrada", 404);
  }

  await checkProjectAccess(userId, task.projectId);

  return await prisma.task.delete({
    where: { id: taskId },
  });
};
