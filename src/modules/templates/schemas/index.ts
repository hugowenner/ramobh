import { z } from "zod";

const templateFieldSchema = z.object({
  id: z.string().min(1),
  type: z.enum([
    "text",
    "textarea",
    "number",
    "date",
    "select",
    "multiselect",
    "checkbox",
    "steps",
    "table",
  ]),
  label: z.string().min(1),
  required: z.boolean(),
  placeholder: z.string().optional(),
  hint: z.string().optional(),
  options: z.array(z.string()).optional(),
  columns: z.array(z.string()).optional(),
  defaultValue: z
    .union([z.string(), z.number(), z.boolean(), z.array(z.string())])
    .optional(),
});

export const templateSchemaSchema = z.object({
  version: z.literal("1"),
  fields: z.array(templateFieldSchema).min(1),
});

export const createTemplateSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  category: z.string().min(1).max(100),
  schema: templateSchemaSchema,
  isActive: z.boolean().default(true),
});

export const updateTemplateSchema = createTemplateSchema.partial();

export const listTemplatesSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type ListTemplatesInput = z.infer<typeof listTemplatesSchema>;
