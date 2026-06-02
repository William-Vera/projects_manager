import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(1, "El nombre de la organización es obligatorio"),
});

export const addMemberSchema = z.object({
  email: z.string().email("El correo no es válido"),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]).optional(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
