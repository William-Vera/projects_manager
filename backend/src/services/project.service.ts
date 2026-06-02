import prisma from "../config/prisma.js";
import { HttpError } from "../errors/http-error.js";
import { createProjectSchema, updateProjectSchema } from "../validators/project.validators.js";

export const createProject = async (userId: string, data: unknown) => {
  const parsed = createProjectSchema.parse(data);

  if (parsed.organizationId) {
    const membership = await prisma.organizationMember.findFirst({
      where: { userId, organizationId: parsed.organizationId },
    });
    if (!membership) {
      throw new HttpError("No eres miembro de la organización especificada", 403);
    }
  }

  return await prisma.projects.create({
    data: {
      name: parsed.name,
      description: parsed.description,
      status: parsed.status ?? "PLANIFICADO",
      startDate: parsed.startDate ?? null,
      endDate: parsed.endDate ?? null,
      duenoId: userId,
      organizationId: parsed.organizationId ?? null,
    },
  });
};

export const listProjects = async (userId: string) => {
  return await prisma.projects.findMany({
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
      dueno: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const getProjectById = async (userId: string, projectId: string) => {
  const project = await prisma.projects.findUnique({
    where: { id: projectId },
    include: {
      dueno: {
        select: { id: true, name: true, email: true },
      },
      tasks: true,
    },
  });

  if (!project) {
    throw new HttpError("Proyecto no encontrado", 404);
  }

  // Check access: owner or member of the project's organization
  if (project.duenoId !== userId && project.organizationId) {
    const membership = await prisma.organizationMember.findFirst({
      where: { userId, organizationId: project.organizationId },
    });
    if (!membership) {
      throw new HttpError("No tienes acceso a este proyecto", 403);
    }
  } else if (project.duenoId !== userId) {
    throw new HttpError("No tienes acceso a este proyecto", 403);
  }

  return project;
};

export const updateProject = async (userId: string, projectId: string, data: unknown) => {
  const parsed = updateProjectSchema.parse(data);

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
    const isOrgAdminOrOwner = membership?.role === "OWNER" || membership?.role === "ADMIN";
    if (!isOrgAdminOrOwner) {
      throw new HttpError("No tienes permisos para actualizar este proyecto", 403);
    }
  } else if (!isOwner) {
    throw new HttpError("No tienes permisos para actualizar este proyecto", 403);
  }

  return await prisma.projects.update({
    where: { id: projectId },
    data: {
      name: parsed.name ?? project.name,
      description: parsed.description ?? project.description,
      status: parsed.status ?? project.status,
      startDate: parsed.startDate !== undefined ? (parsed.startDate ?? null) : project.startDate,
      endDate: parsed.endDate !== undefined ? (parsed.endDate ?? null) : project.endDate,
    },
  });
};

export const deleteProject = async (userId: string, projectId: string) => {
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
    if (membership?.role !== "OWNER") {
      throw new HttpError("No tienes permisos para eliminar este proyecto", 403);
    }
  } else if (!isOwner) {
    throw new HttpError("No tienes permisos para eliminar este proyecto", 403);
  }

  return await prisma.projects.delete({
    where: { id: projectId },
  });
};
