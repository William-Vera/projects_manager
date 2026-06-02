import type { Request, Response } from "express";
import {
  createProject,
  listProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../services/project.service.js";
import { handleControllerError } from "../utils/errors.js";

export const create = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const project = await createProject(userId, req.body);
    return res.status(201).json(project);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const projects = await listProjects(userId);
    return res.status(200).json(projects);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params["id"] as string;
    const project = await getProjectById(userId, id);
    return res.status(200).json(project);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params["id"] as string;
    const project = await updateProject(userId, id, req.body);
    return res.status(200).json(project);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params["id"] as string;
    await deleteProject(userId, id);
    return res.status(200).json({ message: "Proyecto eliminado exitosamente" });
  } catch (error) {
    return handleControllerError(error, res);
  }
};
