import { ValidationError } from "@/core/errors";
import { templateSchemaDefinition } from "../schemas";
import type { TemplateField, TemplateSchema } from "../types";

type TemplateSchemaParseResult =
  | { success: true; data: TemplateSchema }
  | { success: false; error: string };

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
