import { validateTemplateSchema } from "@/modules/templates/utils/schema";
import type { TemplateSchema } from "@/modules/templates/types";
import { ValidationError } from "@/core/errors";
import type { DocumentDetailRow, DocumentEditRow } from "../repositories/document.repository";
import type { DocumentDetail, DocumentEditDefaults, DocumentData } from "../types";

// ── Data parser ───────────────────────────────────────────────

/**
 * Casts Document.data (Prisma JsonValue) to DocumentData.
 * Validates it is a plain object — rejects arrays, primitives.
 */
export function parseDocumentData(raw: unknown, documentId: string): DocumentData {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new ValidationError(
      `Document.data inválido para documento "${documentId}" — esperado objeto JSON`
    );
  }
  return raw as DocumentData;
}

/**
 * Parses Document.schemaSnapshot (Prisma JsonValue) into a typed TemplateSchema.
 * Throws ValidationError if the snapshot is structurally invalid.
 */
export function parseSchemaSnapshot(
  raw: unknown,
  documentId: string
): TemplateSchema {
  try {
    return validateTemplateSchema(raw, `documento ${documentId}`);
  } catch {
    throw new ValidationError(
      `schemaSnapshot corrompido para documento "${documentId}"`
    );
  }
}

// ── Row → DTO mappers ─────────────────────────────────────────

export function mapDetailDTO(row: DocumentDetailRow): DocumentDetail {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    templateId: row.templateId,
    templateVersion: row.templateVersion,
    schemaSnapshot: parseSchemaSnapshot(row.schemaSnapshot, row.id),
    data: parseDocumentData(row.data, row.id),
    clientId: row.clientId,
    projectId: row.projectId,
    environmentId: row.environmentId,
    createdById: row.createdById,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    template: row.template,
    client: row.client,
    project: row.project,
    environment: row.environment,
    createdBy: row.createdBy,
  };
}

export function mapEditDefaults(row: DocumentEditRow): DocumentEditDefaults {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    templateId: row.templateId,
    templateVersion: row.templateVersion,
    schemaSnapshot: parseSchemaSnapshot(row.schemaSnapshot, row.id),
    data: parseDocumentData(row.data, row.id),
    clientId: row.clientId,
    projectId: row.projectId,
    environmentId: row.environmentId,
  };
}

