import { Router } from "express";
import { getMetrics } from "../controllers/dashboard.controller.js";
import { autenticado } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(autenticado);

router.get("/metrics", getMetrics);

export default router;
