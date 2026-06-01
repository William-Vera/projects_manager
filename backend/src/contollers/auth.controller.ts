import type { Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/index.js";
import { registUser, loginUser } from "../services/auth.service.js";
import { HttpError } from "../errors/http-error.js";

function getErrorResponse(error: unknown): { status: number; message: string } {
    if (error instanceof HttpError) {
        return { status: error.statusCode, message: error.message };
    }

    if (error instanceof ZodError) {
        const message = error.issues.map((issue) => issue.message).join(", ");
        return { status: 400, message };
    }

    if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    ) {
        return {
            status: 409,
            message: "Este correo ya se encuentra registrado",
        };
    }

    if (error instanceof Error) {
        return { status: 500, message: error.message };
    }

    return { status: 500, message: "Error interno del servidor" };
}

export const register = async (req: Request, res: Response) => {
    try {
        const user = await registUser(req.body);
        return res.status(201).json(user);
    } catch (error) {
        const { status, message } = getErrorResponse(error);
        return res.status(status).json({ message });
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const result = await loginUser(req.body);
        return res.status(200).json(result);
    } catch (error) {
        const { status, message } = getErrorResponse(error);
        return res.status(status).json({ message });
    }
}

export const profile = async (req: Request, res: Response) => {
    return res.status(200).json(req.user);
}