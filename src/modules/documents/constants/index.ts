import type { DocumentStatus } from "@/generated/prisma";

// ── Status labels ─────────────────────────────────────────────

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  DRAFT: "Rascunho",
  REVIEW: "Em revisão",
  APPROVED: "Aprovado",
  ARCHIVED: "Arquivado",
};

/**
 * Maps DocumentStatus to a shadcn/ui Badge variant.
 * Components cast this to `React.ComponentProps<typeof Badge>["variant"]`.
 */
export const DOCUMENT_STATUS_VARIANTS: Record<
  DocumentStatus,
  "secondary" | "outline" | "default" | "destructive"
> = {
  DRAFT: "secondary",
  REVIEW: "default",
  APPROVED: "default",   // caller applies custom green class
  ARCHIVED: "outline",
};

// ── Status transitions ────────────────────────────────────────

/** Which statuses a document can transition to from a given status */
export const DOCUMENT_STATUS_TRANSITIONS: Record<DocumentStatus, DocumentStatus[]> = {
  DRAFT: ["REVIEW", "ARCHIVED"],
  REVIEW: ["DRAFT", "APPROVED", "ARCHIVED"],
  APPROVED: ["ARCHIVED"],
  ARCHIVED: [],
};

// ── Pagination ────────────────────────────────────────────────

export const PAGE_SIZE = 20;
