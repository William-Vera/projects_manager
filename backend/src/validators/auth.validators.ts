import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(1, "El nombre es obligatorio"),
    email: z.email({
        message: "El correo no es válido"
    }),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.email({ message: "El correo no es válido" }),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;