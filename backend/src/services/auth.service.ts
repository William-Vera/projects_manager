import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";
import { HttpError } from "../errors/http-error.js";
import jwt from "jsonwebtoken";
import { email } from "zod";

export const registUser = async (data: unknown) => {
    const parsed = registerSchema.parse(data);

    const existenUser = await prisma.user.findUnique({
        where: { email: parsed.email },
    });

    if (existenUser) {
        throw new HttpError("Este correo ya se encuentra registrado", 409);
    }

    const passwordHash = await bcrypt.hash(parsed.password, 10);

    const user = await prisma.user.create({
        data: {
            name: parsed.name,
            email: parsed.email,
            password: passwordHash,
        },
    });

    const { password: _password, ...userSinPassword } = user;

    return userSinPassword;
};

export const loginUser = async (
    data: unknown
) => {
    const { email, password } = loginSchema.parse(data);
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        throw new HttpError("Credenciales ingresadas incorrectas", 401);
    }

    const compPassword = await bcrypt.compare(password, user.password);

    if (!compPassword) {
        throw new HttpError("Credenciales ingresadas incorrectas", 401);
    }

    const { password: _password, ...userSinPassword } = user;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new HttpError("Variable JWT no definida mmahuevo", 500);
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: "1d" });


    return { user: userSinPassword, token };
}