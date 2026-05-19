import { ValidationError } from "@/core/errors";
import type { TemplateSchema } from "@/modules/templates/types";
import type { DocumentData } from "../types";

// ── Result type ───────────────────────────────────────────────

export type DocumentValidationResult =
  | { valid: true }
  | { valid: false; errors: string[] };

// ── Validation ────────────────────────────────────────────────

/**
 * Validates DocumentData required fields against a TemplateSchema.
 *
 * Rules:
 * - Required text/textarea/number/date/select: must have a non-empty string value
 * - Required checkbox: must be `true` (explicitly checked)
 * - Optional fields: skipped entirely
 *
 * Returns every violation so the UI can highlight all missing fields at once.
 */
export function validateDocumentData(
  schema: TemplateSchema,
  data: DocumentData
): DocumentValidationResult {
  const errors: string[] = [];

  for (const section of schema.sections) {
    for (const field of section.fields) {
      if (!field.required) continue;

      const value = data[field.id];

      const isEmpty =
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        // A required checkbox must be explicitly checked
        (field.type === "checkbox" && value !== true);

      if (isEmpty) {
        errors.push(`${section.title} › ${field.label}`);
      }
    }
  }

  if (errors.length === 0) return { valid: true };
  return { valid: false, errors };
}

/**
 * Throws a ValidationError-compatible message string if data is invalid.
 * Convenience wrapper for service layer.
 */
export function assertDocumentDataValid(
  schema: TemplateSchema,
  data: DocumentData
): void {
  const result = validateDocumentData(schema, data);
  if (!result.valid) {
    throw new ValidationError(
      `Campos obrigatórios não preenchidos:\n${result.errors.join("\n")}`
    );
  }
}
