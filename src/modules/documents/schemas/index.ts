import { z } from "zod";
import { DocumentStatus } from "@/generated/prisma";

export const documentContentSchema = z.object({
  templateVersion: z.string(),
  fields: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
  ),
});

export const createDocumentSchema = z.object({
  title: z.string().min(2).max(500),
  content: documentContentSchema,
  status: z.nativeEnum(DocumentStatus).default(DocumentStatus.DRAFT),
  clientId: z.string().cuid().optional(),
  projectId: z.string().cuid().optional(),
  environmentId: z.string().cuid().optional(),
  templateId: z.string().cuid().optional(),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(2).max(500).optional(),
  content: documentContentSchema.optional(),
  status: z.nativeEnum(DocumentStatus).optional(),
  environmentId: z.string().cuid().optional().nullable(),
});

export const updateDocumentStatusSchema = z.object({
  status: z.nativeEnum(DocumentStatus),
});

export const listDocumentsSchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(DocumentStatus).optional(),
  clientId: z.string().cuid().optional(),
  projectId: z.string().cuid().optional(),
  templateId: z.string().cuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type ListDocumentsInput = z.infer<typeof listDocumentsSchema>;
