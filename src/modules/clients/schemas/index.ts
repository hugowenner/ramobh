import { z } from "zod";
import { ClientStatus } from "@/generated/prisma";

export const createClientSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(200),
  cnpj: z
    .string()
    .regex(/^\d{14}$/, "CNPJ deve conter 14 dígitos (somente números)")
    .optional()
    .or(z.literal("")),
  segment: z.string().max(100).optional(),
  status: z.nativeEnum(ClientStatus).default(ClientStatus.ACTIVE),
  country: z.string().length(2).default("BR"),
  state: z.string().max(50).optional(),
  city: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
});

export const updateClientSchema = createClientSchema.partial();

export const clientIdSchema = z.object({
  id: z.string().cuid("ID inválido"),
});

export const listClientsSchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(ClientStatus).optional(),
  segment: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type ListClientsInput = z.infer<typeof listClientsSchema>;
