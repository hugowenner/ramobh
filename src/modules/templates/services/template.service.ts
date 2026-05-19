import { NotFoundError } from "@/core/errors";
import { templateRepository } from "../repositories/template.repository";
import { parseTemplateSchema, withParsedSchema } from "./template.parser";
import type {
  CreateTemplateInput,
  UpdateTemplateInput,
  ListTemplatesInput,
} from "../schemas";
import type { PaginatedResult } from "@/types";
import type {
  TemplateRecord,
  TemplateSummary,
  TemplateSchema,
} from "../types";
import type { TemplateWithParsedSchema } from "./template.parser";

export const templateService = {
  async list(
    input: ListTemplatesInput
  ): Promise<PaginatedResult<TemplateSummary>> {
    const { page, limit, search, category, isActive } = input;
    const skip = (page - 1) * limit;
    const { data, total } = await templateRepository.findMany(
      { search, category, isActive },
      { skip, take: limit }
    );
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string): Promise<TemplateWithParsedSchema> {
    const template = await templateRepository.findById(id);
    if (!template) throw new NotFoundError("Template");
    return withParsedSchema(template);
  },

  async getSchema(id: string): Promise<TemplateSchema> {
    const template = await templateRepository.findById(id);
    if (!template) throw new NotFoundError("Template");
    return parseTemplateSchema(template);
  },

  async listActive(): Promise<TemplateSummary[]> {
    return templateRepository.findActive();
  },

  async listCategories(): Promise<string[]> {
    return templateRepository.listCategories();
  },

  async create(input: CreateTemplateInput): Promise<TemplateRecord> {
    return templateRepository.create({
      name: input.name,
      description: input.description ?? null,
      category: input.category,
      schema: input.schema,
      isActive: input.isActive,
    });
  },

  async update(
    id: string,
    input: UpdateTemplateInput
  ): Promise<TemplateRecord> {
    const existing = await templateRepository.findById(id);
    if (!existing) throw new NotFoundError("Template");
    return templateRepository.update(id, input);
  },

  async delete(id: string): Promise<void> {
    const existing = await templateRepository.findById(id);
    if (!existing) throw new NotFoundError("Template");
    await templateRepository.softDelete(id);
  },
};
