import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "El título de la tarea es obligatorio"),
  description: z.string().trim().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
  assignedToId: z.string().uuid("ID de usuario asignado no válido").optional().nullable(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, "El título no puede estar vacío").optional(),
  description: z.string().trim().optional().nullable(),
  status: z.enum(["PENDIENTE", "EN_PROGRESO", "COMPLETADA"]).optional(),
  dueDate: z.coerce.date().optional().nullable(),
  assignedToId: z.string().uuid("ID de usuario no válido").optional().nullable(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["PENDIENTE", "EN_PROGRESO", "COMPLETADA"], {
    error: "Estado no válido. Debe ser PENDIENTE, EN_PROGRESO o COMPLETADA",
  }),
});

export const assignTaskSchema = z.object({
  assignedToId: z.string().uuid("ID de usuario no válido").nullable().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
