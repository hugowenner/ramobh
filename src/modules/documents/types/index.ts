import type { Document, DocumentStatus } from "@/generated/prisma";

// ── Document data ─────────────────────────────────────────────

/**
 * Runtime data: flat map of fieldId → value.
 * Stored in Document.data (Json).
 * Decoupled from schemaSnapshot — only field ids are shared.
 */
export type DocumentData = Record<string, unknown>;

/** Typed field values used internally */
export type FieldValue = string | number | boolean | null | undefined;

// ── Domain DTOs ───────────────────────────────────────────────

/** Used in list table */
export type DocumentListItem = {
  id: string;
  title: string;
  status: DocumentStatus;
  templateVersion: string;
  updatedAt: Date;
  createdAt: Date;
  template: { id: string; name: string; category: string } | null;
  client: { id: string; name: string } | null;
  project: { id: string; name: string } | null;
  createdBy: { id: string; name: string | null } | null;
};

/** Used in detail page — includes parsed schemaSnapshot */
export type DocumentDetail = {
  id: string;
  title: string;
  status: DocumentStatus;
  templateId: string;
  templateVersion: string;
  schemaSnapshot: import("@/modules/templates/types").TemplateSchema;
  data: DocumentData;
  clientId: string | null;
  projectId: string | null;
  environmentId: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  template: { id: string; name: string; category: string } | null;
  client: { id: string; name: string } | null;
  project: { id: string; name: string } | null;
  environment: { id: string; name: string } | null;
  createdBy: { id: string; name: string | null } | null;
};

/** Used to populate the edit form */
export type DocumentEditDefaults = {
  id: string;
  title: string;
  status: DocumentStatus;
  templateId: string;
  templateVersion: string;
  schemaSnapshot: import("@/modules/templates/types").TemplateSchema;
  data: DocumentData;
  clientId: string | null;
  projectId: string | null;
  environmentId: string | null;
};

// ── Filters ───────────────────────────────────────────────────

export type DocumentFilters = {
  search?: string;
  status?: DocumentStatus;
  clientId?: string;
  projectId?: string;
  templateId?: string;
};

export type { DocumentStatus };
export type { Document };
