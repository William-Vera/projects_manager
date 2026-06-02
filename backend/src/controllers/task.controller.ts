import type { Request, Response } from "express";
import {
  createTask,
  listProjectTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  assignTask,
  deleteTask,
} from "../services/task.service.js";
import { handleControllerError } from "../utils/errors.js";

export const create = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const projectId = req.params["projectId"] as string;
    const task = await createTask(userId, projectId, req.body);
    return res.status(201).json(task);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const projectId = req.params["projectId"] as string;
    const tasks = await listProjectTasks(userId, projectId);
    return res.status(200).json(tasks);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params["id"] as string;
    const task = await getTaskById(userId, id);
    return res.status(200).json(task);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params["id"] as string;
    const task = await updateTask(userId, id, req.body);
    return res.status(200).json(task);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params["id"] as string;
    const task = await updateTaskStatus(userId, id, req.body);
    return res.status(200).json(task);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const assign = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params["id"] as string;
    const task = await assignTask(userId, id, req.body);
    return res.status(200).json(task);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params["id"] as string;
    await deleteTask(userId, id);
    return res.status(200).json({ message: "Tarea eliminada exitosamente" });
  } catch (error) {
    return handleControllerError(error, res);
  }
};
