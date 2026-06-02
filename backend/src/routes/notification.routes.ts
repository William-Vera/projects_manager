import { Router } from "express";
import { list, markRead, markAllRead } from "../controllers/notification.controller.js";
import { autenticado } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(autenticado);

router.get("/", list);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", markRead);

export default router;
