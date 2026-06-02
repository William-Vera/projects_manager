import type { Request, Response } from "express";
import { getDashboardMetrics } from "../services/dashboard.service.js";
import { handleControllerError } from "../utils/errors.js";

export const getMetrics = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const metrics = await getDashboardMetrics(userId);
    return res.status(200).json(metrics);
  } catch (error) {
    return handleControllerError(error, res);
  }
};
