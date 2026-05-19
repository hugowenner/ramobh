import type { Prisma } from "@/generated/prisma";
import type { TemplateSchema } from "../types";
import { safeParse, validateTemplateSchema } from "../utils/schema";

// Shape returned by templateRepository.findById (DETAIL_SELECT)
type TemplateRow = { id: string; name: string; schema: Prisma.JsonValue };

/**
 * Parses and validates a raw Json value into a typed TemplateSchema.
 * Throws ValidationError with a user-friendly message on failure.
 * NEVER returns unknown — callers always receive a typed schema.
 *
 * Design note: version literal "1" on the schema type enables
 * future upgradeSchema(v1 → v2) dispatch without breaking existing records.
 */
export function parseTemplateSchema(template: TemplateRow): TemplateSchema {
  return validateTemplateSchema(template.schema, template.name);
}

/**
 * Safe variant — returns null instead of throwing.
 * Used in UI to show "invalid schema" state without crashing.
 */
export function tryParseTemplateSchema(
  raw: unknown
): { ok: true; schema: TemplateSchema } | { ok: false; error: string } {
  const parsed = safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error };
  }
  return { ok: true, schema: parsed.data };
}

export type TemplateWithParsedSchema = Omit<TemplateRow, "schema"> & {
  schema: TemplateSchema;
};

export function withParsedSchema(template: TemplateRow): TemplateWithParsedSchema {
  return {
    ...template,
    schema: parseTemplateSchema(template),
  };
}
