import type { Request, Response } from "express";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} from "../services/notification.service.js";
import { handleControllerError } from "../utils/errors.js";

export const list = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const notifications = await getUserNotifications(userId);
    return res.status(200).json(notifications);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const markRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params["id"] as string;
    const notification = await markAsRead(userId, id);
    return res.status(200).json(notification);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const markAllRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    await markAllAsRead(userId);
    return res.status(200).json({ message: "Todas las notificaciones marcadas como leídas" });
  } catch (error) {
    return handleControllerError(error, res);
  }
};
