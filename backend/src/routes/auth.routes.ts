import { Router } from "express";
import {register, login, profile} from "../controllers/auth.controller.js"
import { autenticado } from "../middlewares/auth.middleware.js";

const router=Router();
router.post("/register",register);
router.post("/login",login);
router.get("/profile", autenticado,profile)

export default router;