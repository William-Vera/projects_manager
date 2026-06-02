import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "El nombre del proyecto es obligatorio"),
  description: z.string().trim().min(1, "La descripción del proyecto es obligatoria"),
  status: z.enum(["PLANIFICADO", "EN_CURSO", "COMPLETADO", "CANCELADO"]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  organizationId: z.string().uuid("ID de organización no válido").optional().nullable(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "El nombre no puede estar vacío").optional(),
  description: z.string().trim().min(1, "La descripción no puede estar vacía").optional(),
  status: z.enum(["PLANIFICADO", "EN_CURSO", "COMPLETADO", "CANCELADO"]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
