import type { Request, Response } from "express";
import {
  createOrganization,
  listOrganizations,
  getOrganizationById,
  addOrganizationMember,
  removeOrganizationMember,
} from "../services/organization.service.js";
import { handleControllerError } from "../utils/errors.js";

export const create = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const org = await createOrganization(userId, req.body);
    return res.status(201).json(org);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const orgs = await listOrganizations(userId);
    return res.status(200).json(orgs);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params["id"] as string;
    const org = await getOrganizationById(userId, id);
    return res.status(200).json(org);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const addMember = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params["id"] as string;
    const member = await addOrganizationMember(userId, id, req.body);
    return res.status(201).json(member);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

export const removeMember = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params["id"] as string;
    const memberId = req.params["userId"] as string;
    await removeOrganizationMember(userId, id, memberId);
    return res.status(200).json({ message: "Miembro removido exitosamente" });
  } catch (error) {
    return handleControllerError(error, res);
  }
};
