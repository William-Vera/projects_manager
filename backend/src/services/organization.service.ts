import prisma from "../config/prisma.js";
import { HttpError } from "../errors/http-error.js";
import { createOrganizationSchema, addMemberSchema } from "../validators/organization.validators.js";

export const createOrganization = async (userId: string, data: unknown) => {
  const parsed = createOrganizationSchema.parse(data);

  return await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: {
        name: parsed.name,
        ownerId: userId,
      },
    });

    await tx.organizationMember.create({
      data: {
        userId,
        organizationId: org.id,
        role: "OWNER",
      },
    });

    return org;
  });
};

export const listOrganizations = async (userId: string) => {
  return await prisma.organization.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const getOrganizationById = async (userId: string, orgId: string) => {
  const membership = await prisma.organizationMember.findFirst({
    where: { userId, organizationId: orgId },
  });

  if (!membership) {
    throw new HttpError("Organización no encontrada o no tienes acceso", 403);
  }

  return await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      projects: true,
    },
  });
};

export const addOrganizationMember = async (userId: string, orgId: string, data: unknown) => {
  const parsed = addMemberSchema.parse(data);

  // Check if current user is owner or admin in the organization
  const membership = await prisma.organizationMember.findFirst({
    where: { userId, organizationId: orgId },
  });

  if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
    throw new HttpError("No tienes permisos para agregar miembros a esta organización", 403);
  }

  // Find user to add
  const userToAdd = await prisma.user.findUnique({
    where: { email: parsed.email },
  });

  if (!userToAdd) {
    throw new HttpError("El usuario con ese correo no existe", 404);
  }

  // Check if already a member
  const existingMember = await prisma.organizationMember.findFirst({
    where: { userId: userToAdd.id, organizationId: orgId },
  });

  if (existingMember) {
    throw new HttpError("El usuario ya es miembro de la organización", 400);
  }

  return await prisma.organizationMember.create({
    data: {
      userId: userToAdd.id,
      organizationId: orgId,
      role: parsed.role || "MEMBER",
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const removeOrganizationMember = async (userId: string, orgId: string, memberIdToRemove: string) => {
  // Check permission of current user
  const membership = await prisma.organizationMember.findFirst({
    where: { userId, organizationId: orgId },
  });

  if (!membership) {
    throw new HttpError("No tienes acceso a esta organización", 403);
  }

  // A member can remove themselves, or an ADMIN/OWNER can remove others
  const isRemovingSelf = userId === memberIdToRemove;
  const isAuthorized = membership.role === "OWNER" || membership.role === "ADMIN" || isRemovingSelf;

  if (!isAuthorized) {
    throw new HttpError("No tienes permisos para remover miembros de esta organización", 403);
  }

  // Find target membership
  const targetMembership = await prisma.organizationMember.findFirst({
    where: { userId: memberIdToRemove, organizationId: orgId },
  });

  if (!targetMembership) {
    throw new HttpError("El miembro no pertenece a la organización", 404);
  }

  // Owner cannot be removed (unless they delete the organization or transfer ownership)
  if (targetMembership.role === "OWNER") {
    throw new HttpError("No se puede remover al propietario de la organización", 400);
  }

  return await prisma.organizationMember.delete({
    where: { id: targetMembership.id },
  });
};
