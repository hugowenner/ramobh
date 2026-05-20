import { z } from "zod";
import { NotFoundError, ValidationError } from "@/core/errors";
import { documentRepository } from "../repositories/document.repository";
import { mapDetailDTO, mapEditDefaults, parseSchemaSnapshot } from "./document.parser";
import { templateService } from "@/modules/templates/services/template.service";
import { getTemplateVersion } from "@/modules/templates/utils/schema";
import { assertDocumentDataValid } from "../validators";
import { DOCUMENT_STATUS_TRANSITIONS } from "../constants";
import {
  createDocumentSchema,
  listDocumentsSchema,
  updateDocumentSchema,
  updateDocumentStatusSchema,
} from "../schemas";
import type { Prisma } from "@/generated/prisma";
import type { PaginatedResult } from "@/types";
import type {
  DocumentDetail,
  DocumentEditDefaults,
  DocumentListItem,
} from "../types";
import type {
  CreateDocumentInput,
  UpdateDocumentInput,
  UpdateDocumentStatusInput,
} from "../schemas";

// ── Zod helpers ───────────────────────────────────────────────

type ZodResult<T> =
  | { success: true; data: T }
  | { success: false; error: z.ZodError };

function formatZodError(error: z.ZodError): string {
  const first = error.issues[0];
  const path = first?.path.join(".") ?? "";
  const msg = first?.message ?? "dados inválidos";
  return path ? `${path}: ${msg}` : msg;
}

function parseOrThrow<T>(result: ZodResult<T>): T {
  if (!result.success) throw new ValidationError(formatZodError(result.error));
  return result.data;
}

// ── Service ───────────────────────────────────────────────────

export const documentService = {
  // ── List ────────────────────────────────────────────────────

  async list(input: unknown): Promise<PaginatedResult<DocumentListItem>> {
    const { page, limit, search, status, clientId, projectId, templateId } =
      parseOrThrow(
        listDocumentsSchema.safeParse(input) as ZodResult<
          z.infer<typeof listDocumentsSchema>
        >
      );

    const skip = (page - 1) * limit;
    const filters = { search, status, clientId, projectId, templateId };

    const [rows, total] = await Promise.all([
      documentRepository.findMany(filters, { skip, take: limit }),
      documentRepository.count(filters),
    ]);

    return {
      data: rows as unknown as DocumentListItem[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // ── Get by id ────────────────────────────────────────────────

  async getById(id: string): Promise<DocumentDetail> {
    const row = await documentRepository.findById(id);
    if (!row) throw new NotFoundError("Documento");
    return mapDetailDTO(row);
  },

  async getForEdit(id: string): Promise<DocumentEditDefaults> {
    const row = await documentRepository.findForEdit(id);
    if (!row) throw new NotFoundError("Documento");
    return mapEditDefaults(row);
  },

  // ── Create ───────────────────────────────────────────────────

  /**
   * Creates a document.
   * Clones the current template schema into `schemaSnapshot` — this copy
   * is immutable after creation and drives rendering and PDF generation.
   */
  async create(
    input: unknown,
    createdById: string
  ): Promise<DocumentEditDefaults> {
    const parsed = parseOrThrow(
      createDocumentSchema.safeParse(input) as ZodResult<CreateDocumentInput>
    );

    // 1. Fetch template — validates it exists and is active
    const template = await templateService.getTemplateById(parsed.templateId);
    if (!template.isActive) {
      throw new ValidationError("Template inativo — não é possível criar documentos");
    }

    // 2. Validate required fields in data
    assertDocumentDataValid(template.schema, parsed.data);

    // 3. Persist with immutable schemaSnapshot
    const row = await documentRepository.create({
      title: parsed.title,
      templateVersion: getTemplateVersion(template.schema),
      schemaSnapshot: template.schema as unknown as Prisma.InputJsonValue,
      data: parsed.data as unknown as Prisma.InputJsonValue,
      status: parsed.status,
      template: { connect: { id: parsed.templateId } },
      createdBy: { connect: { id: createdById } },
      ...(parsed.clientId && { client: { connect: { id: parsed.clientId } } }),
      ...(parsed.projectId && {
        project: { connect: { id: parsed.projectId } },
      }),
      ...(parsed.environmentId && {
        environment: { connect: { id: parsed.environmentId } },
      }),
    });

    return mapEditDefaults(row);
  },

  // ── Update ───────────────────────────────────────────────────

  /**
   * Updates title, data, and/or relation fields.
   * Does NOT allow changing the template or schemaSnapshot.
   * APPROVED documents cannot be edited.
   */
  async update(
    id: string,
    input: unknown
  ): Promise<DocumentEditDefaults> {
    const parsed = parseOrThrow(
      updateDocumentSchema.safeParse(input) as ZodResult<UpdateDocumentInput>
    );

    const existing = await documentRepository.findForEdit(id);
    if (!existing) throw new NotFoundError("Documento");

    if (existing.status === "APPROVED") {
      throw new ValidationError("Documentos aprovados não podem ser editados");
    }

    // If data is being replaced, validate required fields against snapshot
    if (parsed.data !== undefined) {
      const schema = parseSchemaSnapshot(existing.schemaSnapshot, id);
      assertDocumentDataValid(schema, parsed.data);
    }

    const row = await documentRepository.update(id, {
      ...(parsed.title !== undefined && { title: parsed.title }),
      ...(parsed.data !== undefined && {
        data: parsed.data as unknown as Prisma.InputJsonValue,
      }),
      // Explicit null clears the relation; undefined = no change
      ...(parsed.clientId !== undefined && {
        clientId: parsed.clientId ?? null,
      }),
      ...(parsed.projectId !== undefined && {
        projectId: parsed.projectId ?? null,
      }),
      ...(parsed.environmentId !== undefined && {
        environmentId: parsed.environmentId ?? null,
      }),
    });

    return mapEditDefaults(row);
  },

  // ── Status update ─────────────────────────────────────────────

  async updateStatus(
    id: string,
    input: unknown
  ): Promise<DocumentEditDefaults> {
    const { status: newStatus } = parseOrThrow(
      updateDocumentStatusSchema.safeParse(
        input
      ) as ZodResult<UpdateDocumentStatusInput>
    );

    const existing = await documentRepository.findForEdit(id);
    if (!existing) throw new NotFoundError("Documento");

    const allowed = DOCUMENT_STATUS_TRANSITIONS[existing.status];
    if (!allowed.includes(newStatus)) {
      throw new ValidationError(
        `Transição inválida: ${existing.status} → ${newStatus}`
      );
    }

    const row = await documentRepository.update(id, { status: newStatus });
    return mapEditDefaults(row);
  },

  // ── Delete ───────────────────────────────────────────────────

  async delete(id: string): Promise<void> {
    const existing = await documentRepository.findForEdit(id);
    if (!existing) throw new NotFoundError("Documento");
    await documentRepository.softDelete(id);
  },
};
