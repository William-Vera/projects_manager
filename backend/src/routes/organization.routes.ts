import { Router } from "express";
import { create, list, getById, addMember, removeMember } from "../controllers/organization.controller.js";
import { autenticado } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(autenticado);

router.post("/", create);
router.get("/", list);
router.get("/:id", getById);
router.post("/:id/members", addMember);
router.delete("/:id/members/:userId", removeMember);

export default router;
