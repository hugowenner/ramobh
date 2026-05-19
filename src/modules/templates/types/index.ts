import type { Template } from "@/generated/prisma";

// ── Template JSON schema ─────────────────────────────────────

export type TemplateFieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "multiselect"
  | "checkbox"
  | "steps"
  | "table";

export type TemplateField = {
  id: string;
  type: TemplateFieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  hint?: string;
  options?: string[];    // select / multiselect
  columns?: string[];    // table
  defaultValue?: string | number | boolean | string[];
};

/**
 * Estrutura armazenada em Template.schema (campo Json do Prisma).
 * Versionada para suportar migrações de schema sem quebrar documentos existentes.
 */
export type TemplateSchema = {
  version: "1";
  fields: TemplateField[];
};

// ── Domain types ─────────────────────────────────────────────

export type TemplateRecord = Template;

export type TemplateSummary = Pick<
  Template,
  "id" | "name" | "description" | "category" | "isActive" | "createdAt"
>;

export type TemplateFilters = {
  search?: string;
  category?: string;
  isActive?: boolean;
};
