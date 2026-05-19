import { ValidationError } from "@/core/errors";
import { templateSchemaDefinition } from "../schemas";
import type { TemplateField, TemplateSchema } from "../types";

/**
 * Derives a stable URL/DB slug from a template name.
 * Strips diacritics, lowercases, collapses non-alphanumeric to hyphens.
 *
 * Used both by the seed (explicit slugs verified against this) and by the
 * service when a user creates a template via the UI.
 *
 * IMPORTANT: slug is set once at creation and never updated, even if the
 * template is renamed — it is a stable identifier, not a display value.
 */
export function toSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type TemplateSchemaParseResult =
  | { success: true; data: TemplateSchema }
  | { success: false; error: string };

/**
 * Detects the legacy flat-fields format:
 *   { version: "1", fields: [...] }   ← old, pre-sections format
 *
 * Any schema matching this shape is incompatible with the current
 * TemplateSchema type and must be migrated or re-seeded.
 */
export function isLegacyTemplateSchema(raw: unknown): boolean {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return false;
  const obj = raw as Record<string, unknown>;
  return Array.isArray(obj["fields"]) && !Array.isArray(obj["sections"]);
}

export function safeParse(raw: unknown): TemplateSchemaParseResult {
  const parsed = templateSchemaDefinition.safeParse(raw);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const path = firstIssue?.path.join(".") ?? "";
    const message = firstIssue?.message ?? "estrutura invalida";
    const error = path ? `${path}: ${message}` : message;
    return { success: false, error };
  }
  return { success: true, data: parsed.data };
}

export function validateTemplateSchema(
  raw: unknown,
  context?: string
): TemplateSchema {
  // Fast-fail with a descriptive message before running full Zod parse
  if (isLegacyTemplateSchema(raw)) {
    const prefix = context
      ? `Schema do template "${context}"`
      : "Schema do template";
    throw new ValidationError(
      `${prefix} usa formato legado ({ fields: [] } na raiz). ` +
        `Formato atual exige sections[]. Execute: npm run db:reset`
    );
  }

  const parsed = safeParse(raw);
  if (!parsed.success) {
    const prefix = context
      ? `Schema do template "${context}" e invalido`
      : "Schema do template e invalido";
    throw new ValidationError(`${prefix}: ${parsed.error}`);
  }
  return parsed.data;
}

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

export function getTemplateVersion(schema: TemplateSchema): string {
  return schema.version;
}
