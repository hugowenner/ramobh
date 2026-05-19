import { z } from "zod";
import type { TemplateSchema } from "../types";
import { PAGE_SIZE } from "../constants";

const fieldBaseSchema = z.object({
  id: z.string().min(1, "id obrigatório"),
  label: z.string().min(1, "label obrigatório"),
  required: z.boolean(),
  placeholder: z.string().optional(),
});

const textFieldSchema = fieldBaseSchema
  .extend({ type: z.literal("text") })
  .strict();

const textareaFieldSchema = fieldBaseSchema
  .extend({ type: z.literal("textarea") })
  .strict();

const numberFieldSchema = fieldBaseSchema
  .extend({ type: z.literal("number") })
  .strict();

const dateFieldSchema = fieldBaseSchema
  .extend({ type: z.literal("date") })
  .strict();

const checkboxFieldSchema = fieldBaseSchema
  .extend({ type: z.literal("checkbox") })
  .strict();

const selectFieldSchema = fieldBaseSchema
  .extend({
    type: z.literal("select"),
    options: z
      .array(z.string().min(1))
      .min(1, "select exige options"),
  })
  .strict();

export const fieldSchema = z.discriminatedUnion("type", [
  textFieldSchema,
  textareaFieldSchema,
  numberFieldSchema,
  selectFieldSchema,
  checkboxFieldSchema,
  dateFieldSchema,
]);

export const sectionSchema = z
  .object({
    id: z.string().min(1, "id obrigatório"),
    title: z.string().min(1, "título obrigatório"),
    fields: z.array(fieldSchema).min(1, "mínimo 1 field"),
  })
  .strict();

export const templateSchemaDefinition: z.ZodType<TemplateSchema> = z
  .object({
    version: z.string().min(1, "version obrigatória"),
    sections: z.array(sectionSchema).min(1, "mínimo 1 section"),
  })
  .strict();

export const createTemplateSchema = z.object({
  name: z.string().min(2, "mínimo 2 caracteres").max(200),
  description: z.string().min(1, "descricao obrigatoria").max(2000),
  category: z.string().min(1, "categoria obrigatória").max(100),
  schema: templateSchemaDefinition,
  isActive: z.boolean().default(true),
});

export const updateTemplateSchema = createTemplateSchema.partial();

export const listTemplatesSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(PAGE_SIZE),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type ListTemplatesInput = z.infer<typeof listTemplatesSchema>;
