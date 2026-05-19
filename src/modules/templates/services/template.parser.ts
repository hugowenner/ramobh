import { templateSchemaSchema } from "../schemas";
import type { TemplateSchema } from "../types";
import type { Template } from "@/generated/prisma";
import { ValidationError } from "@/core/errors";

/**
 * Converte Template.schema (JsonValue) para TemplateSchema tipado.
 * Lança ValidationError se o schema estiver corrompido — nunca retorna unknown.
 */
export function parseTemplateSchema(template: Template): TemplateSchema {
  const parsed = templateSchemaSchema.safeParse(template.schema);
  if (!parsed.success) {
    throw new ValidationError(
      `Schema do template "${template.name}" está corrompido`
    );
  }
  return parsed.data as TemplateSchema;
}

export type TemplateWithParsedSchema = Omit<Template, "schema"> & {
  schema: TemplateSchema;
};

export function withParsedSchema(template: Template): TemplateWithParsedSchema {
  return {
    ...template,
    schema: parseTemplateSchema(template),
  };
}
