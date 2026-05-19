import type { TemplateSchema } from "@/modules/templates/types";
import type { DocumentData } from "@/modules/documents/types";

// ── Input passed to the generator ─────────────────────────────

/**
 * Self-contained snapshot of everything the PDF generator needs.
 * Deliberately decoupled from Prisma types — constructed from DocumentDetail
 * in the service layer so the generator has zero DB dependencies.
 */
export type DocumentPdfData = {
  // Identity
  id: string;
  title: string;

  // Versioning
  templateVersion: string;
  /** Document.updatedAt.toISOString() — used as the immutable version stamp */
  documentVersion: string;
  generatedAt: Date;

  // Content — always from schemaSnapshot, never from current template
  schemaSnapshot: TemplateSchema;
  data: DocumentData;

  // Status
  status: string; // human-readable label, not the enum

  // Relations (nullable — not all documents are linked)
  template: { name: string; category: string } | null;
  client: { name: string } | null;
  project: { name: string } | null;
  environment: { name: string } | null;
  createdBy: { name: string | null } | null;
  createdAt: Date;
};

// ── Service output ─────────────────────────────────────────────

export type PdfGenerationResult = {
  id: string;
  storagePath: string;
  filename: string;
  size: number;
  downloadUrl: string;
};
