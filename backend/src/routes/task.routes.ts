import { Router } from "express";
import { create, list, getById, update, changeStatus, assign, remove } from "../controllers/task.controller.js";
import { autenticado } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(autenticado);

// Project-scoped task endpoints
router.post("/projects/:projectId/tasks", create);
router.get("/projects/:projectId/tasks", list);

// Single task endpoints
router.get("/tasks/:id", getById);
router.put("/tasks/:id", update);
router.patch("/tasks/:id/status", changeStatus);
router.patch("/tasks/:id/assign", assign);
router.delete("/tasks/:id", remove);

export default router;
