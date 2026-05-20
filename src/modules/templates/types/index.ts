import type { Template } from "@/generated/prisma";

// ── Field types suportados pelo renderer ──────────────────────────────────────

export type TemplateFieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "checkbox"
  | "date";

// ── Field — contrato mínimo (core contract) ───────────────────────────────────
//
// IMUTÁVEL: id + type + label são os únicos campos garantidos para sempre.
// Todo o resto (ui, validation, business, dependsOn, integration, custom…)
// é extensão livre — aceito mas nunca validado pelo core engine.
// O renderer valida o que precisa renderizar (fieldSchema em schemas/index.ts).

export interface TemplateField {
  id: string;
  type: TemplateFieldType;
  label: string;
  // Campos opcionais do renderer atual
  required?: boolean;
  placeholder?: string;
  options?: string[];
  // Extensão livre — UI hints, regras de negócio, integração SAP, etc.
  [key: string]: unknown;
}

// ── Section ───────────────────────────────────────────────────────────────────

export interface TemplateSection {
  id: string;
  title: string;
  fields: TemplateField[];
  // Extensão livre — description, order, collapsible, dependsOn, ui, custom…
  [key: string]: unknown;
}

// ── Meta — localização canônica da versão ─────────────────────────────────────

export interface TemplateSchemaMeta {
  /** Versão do schema. Localização canônica (migrado de schema.version). */
  version: string;
  // Extensão livre — id, name, tags, owner, language, etc.
  [key: string]: unknown;
}

// ── TemplateSchema canônico ───────────────────────────────────────────────────
//
// Formato canônico (v1.0+):
//   { meta: { version: "1.0.0" }, sections: [...], layout?: {}, extensions?: {} }
//
// Formato legado (ainda lido via normalizeFormSchema):
//   { version: "1.0", sections: [...] }
//
// normalizeFormSchema() converte legado → canônico ANTES da validação Zod.
// Código novo deve sempre escrever e ler pelo formato canônico.

export interface TemplateSchema {
  /** Metadados do schema. version DEVE estar aqui. */
  meta: TemplateSchemaMeta;
  sections: TemplateSection[];
  /** Configuração de layout global (colunas, densidade, UX). Opcional. */
  layout?: Record<string, unknown>;
  /** Namespace de plugins e integrações externas. Nunca validado pelo core. */
  extensions?: Record<string, unknown>;
  /**
   * @deprecated Mantido para backward compat com snapshots já salvos no banco.
   * Novos schemas NÃO devem usar este campo.
   * Use meta.version. O normalizeFormSchema migra este campo automaticamente.
   */
  version?: string;
}

// ── DTOs ──────────────────────────────────────────────────────────────────────

export type TemplateListDTO = Pick<Template, "id" | "name" | "category" | "updatedAt"> & {
  version: string;
  sectionCount: number;
  fieldCount: number;
};

export type TemplateDetailDTO = Pick<
  Template,
  "id" | "name" | "description" | "category" | "isActive" | "createdAt" | "updatedAt"
> & {
  schema: TemplateSchema;
};

export type TemplateEditDTO = Pick<
  Template,
  "id" | "name" | "description" | "category" | "isActive"
> & {
  schema: TemplateSchema;
};

export type TemplateFilters = {
  search?: string;
  category?: string;
  isActive?: boolean;
};
