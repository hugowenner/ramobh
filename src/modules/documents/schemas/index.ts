import { z } from "zod";
import { DocumentStatus } from "@/generated/prisma";

// ── Field value ───────────────────────────────────────────────

/**
 * A single document field value.
 * Record<fieldId, FieldValue> is stored as Document.data (Json).
 */
export const fieldValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

export const documentDataSchema = z.record(z.string(), z.unknown());

// ── Create ────────────────────────────────────────────────────

export const createDocumentSchema = z.object({
  title: z.string().min(2, "Título muito curto").max(500, "Título muito longo"),
  templateId: z.string().cuid("Template inválido"),
  /** Field values — validated against template schema at service layer */
  data: documentDataSchema.default({}),
  status: z.nativeEnum(DocumentStatus).default(DocumentStatus.DRAFT),
  clientId: z.string().cuid().nullable().optional(),
  projectId: z.string().cuid().nullable().optional(),
  environmentId: z.string().cuid().nullable().optional(),
});

// ── Update ────────────────────────────────────────────────────

export const updateDocumentSchema = z.object({
  title: z
    .string()
    .min(2, "Título muito curto")
    .max(500, "Título muito longo")
    .optional(),
  /** Full replacement of data map — caller sends all fields */
  data: documentDataSchema.optional(),
  clientId: z.string().cuid().nullable().optional(),
  projectId: z.string().cuid().nullable().optional(),
  environmentId: z.string().cuid().nullable().optional(),
});

// ── Status update ─────────────────────────────────────────────

export const updateDocumentStatusSchema = z.object({
  status: z.nativeEnum(DocumentStatus),
});

// ── List / filter ─────────────────────────────────────────────

export const listDocumentsSchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(DocumentStatus).optional(),
  clientId: z.string().cuid().optional(),
  projectId: z.string().cuid().optional(),
  templateId: z.string().cuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ── Inferred types ────────────────────────────────────────────

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type UpdateDocumentStatusInput = z.infer<typeof updateDocumentStatusSchema>;
export type ListDocumentsInput = z.infer<typeof listDocumentsSchema>;
