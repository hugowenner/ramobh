import { z } from "zod";
import { EnvironmentType } from "@/generated/prisma";

export const createEnvironmentSchema = z.object({
  name: z.string().min(2).max(200),
  type: z.nativeEnum(EnvironmentType),
  description: z.string().max(2000).optional(),
  clientId: z.string().cuid("Cliente inválido"),
  projectId: z.string().cuid("Projeto inválido").optional(),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
  version: z.string().max(50).optional(),
  notes: z.string().max(2000).optional(),
});

export const updateEnvironmentSchema = createEnvironmentSchema
  .partial()
  .omit({ clientId: true });

export const listEnvironmentsSchema = z.object({
  search: z.string().optional(),
  type: z.nativeEnum(EnvironmentType).optional(),
  clientId: z.string().cuid().optional(),
  projectId: z.string().cuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateEnvironmentInput = z.infer<typeof createEnvironmentSchema>;
export type UpdateEnvironmentInput = z.infer<typeof updateEnvironmentSchema>;
export type ListEnvironmentsInput = z.infer<typeof listEnvironmentsSchema>;
