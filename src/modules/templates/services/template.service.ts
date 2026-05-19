import { z } from "zod";
import { ConflictError, NotFoundError, ValidationError } from "@/core/errors";
import { templateRepository } from "../repositories/template.repository";
import {
  createTemplateSchema,
  listTemplatesSchema,
  updateTemplateSchema,
} from "../schemas";
import type { Prisma } from "@/generated/prisma";
import type { PaginatedResult } from "@/types";
import type {
  TemplateDetailDTO,
  TemplateEditDTO,
  TemplateListDTO,
  TemplateSchema,
} from "../types";
import {
  extractFieldCount,
  extractSectionCount,
  getTemplateVersion,
  validateTemplateSchema,
} from "../utils/schema";

// ── Infer row types from repository ──────────────────────────

type TemplateDetailRecord = NonNullable<
  Awaited<ReturnType<typeof templateRepository.findById>>
>;
type TemplateEditRecord = Awaited<ReturnType<typeof templateRepository.create>>;
type TemplateListRecord = Awaited<
  ReturnType<typeof templateRepository.findMany>
>[number];

// ── Parse helpers ─────────────────────────────────────────────

type ZodResult<T> =
  | { success: true; data: T }
  | { success: false; error: z.ZodError };

function formatZodError(error: z.ZodError): string {
  const firstIssue = error.issues[0];
  const path = firstIssue?.path.join(".") ?? "";
  const message = firstIssue?.message ?? "dados invalidos";
  return path ? `${path}: ${message}` : message;
}

function parseOrThrow<T>(result: ZodResult<T>): T {
  if (!result.success) {
    throw new ValidationError(formatZodError(result.error));
  }
  return result.data;
}

// ── DTO mappers ───────────────────────────────────────────────

function mapListDTO(record: TemplateListRecord): TemplateListDTO {
  const schema = validateTemplateSchema(record.schema, record.name);
  return {
    id: record.id,
    name: record.name,
    category: record.category,
    updatedAt: record.updatedAt,
    version: getTemplateVersion(schema),
    sectionCount: extractSectionCount(schema),
    fieldCount: extractFieldCount(schema),
  };
}

function mapDetailDTO(record: TemplateDetailRecord): TemplateDetailDTO {
  return {
    ...record,
    schema: validateTemplateSchema(record.schema, record.name),
  };
}

function mapEditDTO(
  record: TemplateEditRecord,
  schemaOverride?: TemplateSchema
): TemplateEditDTO {
  return {
    ...record,
    schema:
      schemaOverride ?? validateTemplateSchema(record.schema, record.name),
  };
}

// ── Service ───────────────────────────────────────────────────

export const templateService = {
  async listTemplates(
    input: unknown
  ): Promise<PaginatedResult<TemplateListDTO>> {
    const { page, limit, search, category } = parseOrThrow(
      listTemplatesSchema.safeParse(input) as ZodResult<
        z.infer<typeof listTemplatesSchema>
      >
    );
    const skip = (page - 1) * limit;
    const [rows, total] = await Promise.all([
      templateRepository.findMany({ search, category }, { skip, take: limit }),
      templateRepository.count({ search, category }),
    ]);
    return {
      data: rows.map(mapListDTO),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getTemplateById(id: string): Promise<TemplateDetailDTO> {
    const template = await templateRepository.findById(id);
    if (!template) throw new NotFoundError("Template");
    return mapDetailDTO(template);
  },

  async getTemplateSchema(id: string): Promise<TemplateSchema> {
    const template = await templateRepository.findById(id);
    if (!template) throw new NotFoundError("Template");
    return validateTemplateSchema(template.schema, template.name);
  },

  async createTemplate(input: unknown): Promise<TemplateEditDTO> {
    const parsed = parseOrThrow(
      createTemplateSchema.safeParse(input) as ZodResult<
        z.infer<typeof createTemplateSchema>
      >
    );
    const schema = validateTemplateSchema(parsed.schema, parsed.name);

    const exists = await templateRepository.existsByName(parsed.name);
    if (exists) throw new ConflictError(`Template "${parsed.name}"`);

    const record = await templateRepository.create({
      name: parsed.name,
      description: parsed.description ?? null,
      category: parsed.category,
      schema: schema as unknown as Prisma.InputJsonValue,
      isActive: parsed.isActive,
    });
    return mapEditDTO(record, schema);
  },

  async updateTemplate(id: string, input: unknown): Promise<TemplateEditDTO> {
    const existing = await templateRepository.findById(id);
    if (!existing) throw new NotFoundError("Template");

    const parsed = parseOrThrow(
      updateTemplateSchema.safeParse(input) as ZodResult<
        z.infer<typeof updateTemplateSchema>
      >
    );

    if (parsed.name && parsed.name !== existing.name) {
      const nameConflict = await templateRepository.existsByName(
        parsed.name,
        id
      );
      if (nameConflict) throw new ConflictError(`Template "${parsed.name}"`);
    }

    const schema =
      parsed.schema !== undefined
        ? validateTemplateSchema(
            parsed.schema,
            parsed.name ?? existing.name
          )
        : undefined;

    const record = await templateRepository.update(id, {
      ...(parsed.name !== undefined && { name: parsed.name }),
      ...(parsed.description !== undefined && {
        description: parsed.description ?? null,
      }),
      ...(parsed.category !== undefined && { category: parsed.category }),
      ...(schema !== undefined && {
        schema: schema as unknown as Prisma.InputJsonValue,
      }),
      ...(parsed.isActive !== undefined && { isActive: parsed.isActive }),
    });
    return mapEditDTO(record);
  },

  async deleteTemplate(id: string): Promise<void> {
    const existing = await templateRepository.findById(id);
    if (!existing) throw new NotFoundError("Template");
    await templateRepository.softDelete(id);
  },

  async listCategories(): Promise<string[]> {
    return templateRepository.listCategories();
  },

  async listActive(): Promise<TemplateListDTO[]> {
    const rows = await templateRepository.findActive();
    return rows.map(mapListDTO);
  },

  // Shorthand aliases
  async list(input: unknown) {
    return templateService.listTemplates(input);
  },
  async getById(id: string) {
    return templateService.getTemplateById(id);
  },
  async getSchema(id: string) {
    return templateService.getTemplateSchema(id);
  },
  async create(input: unknown) {
    return templateService.createTemplate(input);
  },
  async update(id: string, input: unknown) {
    return templateService.updateTemplate(id, input);
  },
  async delete(id: string) {
    return templateService.deleteTemplate(id);
  },
};
