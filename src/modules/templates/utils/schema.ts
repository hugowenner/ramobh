import { ValidationError } from "@/core/errors";
import { templateSchemaDefinition } from "../schemas";
import type { TemplateField, TemplateSchema } from "../types";

// ── Slug ──────────────────────────────────────────────────────────────────────

/**
 * Derives a stable URL/DB slug from a template name.
 * Strips diacritics, lowercases, collapses non-alphanumeric to hyphens.
 *
 * IMPORTANT: slug is set once at creation and never updated, even if the
 * template is renamed — it is a stable identifier, not a display value.
 */
export function toSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Normalizer — pre-processor obrigatório antes de qualquer validação ────────
//
// Transforma todos os formatos legados para o formato canônico:
//   { meta: { version }, sections: [...], layout?: {}, extensions?: {} }
//
// Formatos reconhecidos e normalizados:
//   Caso A: já canônico     → { meta: { version }, sections }  → pass-through
//   Caso B: versão na raiz  → { version, sections }            → meta.version
//   Caso C: sem versão      → { sections }                     → meta.version = "1.0.0"
//
// Nunca lança exceção — retorna sempre um objeto normalizável.
// A validação Zod que vem depois é quem lança erros estruturais.

export function normalizeFormSchema(raw: unknown): unknown {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return raw; // não é objeto — deixa o Zod rejeitar
  }

  const obj = raw as Record<string, unknown>;

  // Extrair meta existente (se houver), garantindo que é um objeto
  const existingMeta =
    typeof obj["meta"] === "object" && obj["meta"] !== null && !Array.isArray(obj["meta"])
      ? (obj["meta"] as Record<string, unknown>)
      : {};

  // Caso A: já tem meta.version → formato canônico, pass-through
  if (typeof existingMeta["version"] === "string" && existingMeta["version"].length > 0) {
    return raw;
  }

  // Caso B: version na raiz (formato legado atual) → mover para meta.version
  if (typeof obj["version"] === "string" && obj["version"].length > 0) {
    return {
      ...obj,
      meta: {
        version: obj["version"],
        ...existingMeta,
      },
      // Manter version na raiz por backward compat com snapshots existentes
    };
  }

  // Caso C: sem version em nenhum lugar → injetar default
  return {
    ...obj,
    meta: {
      version: "1.0.0",
      ...existingMeta,
    },
  };
}

// ── Legacy detection ──────────────────────────────────────────────────────────

/**
 * Detecta o formato pré-sections (muito antigo):
 *   { version: "1", fields: [...] }
 *
 * Este formato NÃO é normalizável — requer re-seed.
 */
export function isLegacyTemplateSchema(raw: unknown): boolean {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return false;
  const obj = raw as Record<string, unknown>;
  return Array.isArray(obj["fields"]) && !Array.isArray(obj["sections"]);
}

// ── Parse result ──────────────────────────────────────────────────────────────

type TemplateSchemaParseResult =
  | { success: true; data: TemplateSchema }
  | { success: false; error: string };

/**
 * Normaliza → valida com Zod.
 * Não lança exceção — retorna resultado tipado.
 */
export function safeParse(raw: unknown): TemplateSchemaParseResult {
  const normalized = normalizeFormSchema(raw);
  const parsed = templateSchemaDefinition.safeParse(normalized);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const path = firstIssue?.path.join(".") ?? "";
    const message = firstIssue?.message ?? "estrutura invalida";
    const error = path ? `${path}: ${message}` : message;
    return { success: false, error };
  }

  return { success: true, data: parsed.data as TemplateSchema };
}

/**
 * Normaliza → valida → retorna TemplateSchema tipado.
 * Lança ValidationError se inválido.
 *
 * Fluxo: raw → isLegacyCheck → normalizeFormSchema → Zod → TemplateSchema
 */
export function validateTemplateSchema(
  raw: unknown,
  context?: string
): TemplateSchema {
  const prefix = context
    ? `Schema do template "${context}"`
    : "Schema do template";

  // Rejeita formato pré-sections (não normalizável)
  if (isLegacyTemplateSchema(raw)) {
    throw new ValidationError(
      `${prefix} usa formato legado ({ fields: [] } na raiz). ` +
        `Formato atual exige sections[]. Execute: npm run db:reset`
    );
  }

  const parsed = safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError(`${prefix} é inválido: ${parsed.error}`);
  }

  return parsed.data;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function isSelectField(
  field: TemplateField
): field is TemplateField & { type: "select"; options: string[] } {
  return field.type === "select";
}

export function extractFieldCount(schema: TemplateSchema): number {
  return schema.sections.reduce((total, section) => total + section.fields.length, 0);
}

export function extractSectionCount(schema: TemplateSchema): number {
  return schema.sections.length;
}

/**
 * Lê a versão do schema a partir da localização canônica (meta.version).
 * Cai back para schema.version (legado) se meta.version não existir —
 * garante compatibilidade com snapshots antigos ainda no banco.
 */
export function getTemplateVersion(schema: TemplateSchema): string {
  return schema.meta?.version ?? schema.version ?? "unknown";
}
