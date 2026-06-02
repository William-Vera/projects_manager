import prisma from "../config/prisma.js";

export const createNotification = async (userId: string, message: string) => {
  return await prisma.notification.create({
    data: {
      userId,
      message,
    },
  });
};

export const getUserNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const markAsRead = async (userId: string, notificationId: string) => {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });

  if (!notification) {
    throw new Error("Notificación no encontrada o no pertenece al usuario");
  }

  return await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
};

export const markAllAsRead = async (userId: string) => {
  return await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
};
