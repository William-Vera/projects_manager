import type { Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/index.js";
import { HttpError } from "../errors/http-error.js";

export function handleControllerError(error: unknown, res: Response) {
    if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ message: error.message });
    }

    if (error instanceof ZodError) {
        const message = error.issues.map((issue) => issue.message).join(", ");
        return res.status(400).json({ message });
    }

    if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    ) {
        return res.status(409).json({
            message: "Conflict: Un registro con este valor único ya existe.",
        });
    }

    if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Error interno del servidor" });
}
