import type { Document, DocumentStatus } from "@/generated/prisma";

// ── Document JSON content ────────────────────────────────────

/**
 * Estrutura armazenada em Document.content (campo Json do Prisma).
 * Cada key é um `TemplateField.id`, o value é o dado preenchido.
 *
 * Estratégia de embeddings futura:
 *   - A geração do embedding usará: `title + stringifiedFields`
 *   - Armazenado em tabela separada `DocumentEmbedding` (pgvector)
 *   - O campo `templateVersion` garante chunks consistentes ao re-indexar
 */
export type DocumentContent = {
  templateVersion: string;
  fields: Record<string, string | number | boolean | string[]>;
};

// ── Domain types ─────────────────────────────────────────────

export type DocumentRecord = Document;

export type DocumentSummary = Pick<
  Document,
  | "id"
  | "title"
  | "status"
  | "clientId"
  | "projectId"
  | "environmentId"
  | "templateId"
  | "createdAt"
  | "updatedAt"
>;

export type DocumentFilters = {
  search?: string;
  status?: DocumentStatus;
  clientId?: string;
  projectId?: string;
  templateId?: string;
};

export type { DocumentStatus };
