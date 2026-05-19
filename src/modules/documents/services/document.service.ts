import { NotFoundError, ValidationError } from "@/core/errors";
import { documentRepository } from "../repositories/document.repository";
import { withParsedContent } from "./document.parser";
import { templateService } from "@/modules/templates/services/template.service";
import type {
  CreateDocumentInput,
  UpdateDocumentInput,
  ListDocumentsInput,
} from "../schemas";
import type { PaginatedResult } from "@/types";
import type { DocumentRecord, DocumentSummary } from "../types";
import type { DocumentWithParsedContent } from "./document.parser";

export const documentService = {
  async list(
    input: ListDocumentsInput
  ): Promise<PaginatedResult<DocumentSummary>> {
    const { page, limit, search, status, clientId, projectId, templateId } =
      input;
    const skip = (page - 1) * limit;
    const { data, total } = await documentRepository.findMany(
      { search, status, clientId, projectId, templateId },
      { skip, take: limit }
    );
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string): Promise<DocumentWithParsedContent> {
    const doc = await documentRepository.findById(id);
    if (!doc) throw new NotFoundError("Documento");
    return withParsedContent(doc);
  },

  async getByIdWithAttachments(id: string) {
    const doc = await documentRepository.findByIdWithAttachments(id);
    if (!doc) throw new NotFoundError("Documento");
    return {
      ...withParsedContent(doc),
      attachments: doc.attachments,
    };
  },

  async create(input: CreateDocumentInput): Promise<DocumentRecord> {
    // Valida campos obrigatórios do template se informado
    if (input.templateId) {
      const schema = await templateService.getSchema(input.templateId);
      const missingRequired = schema.fields
        .filter((f) => f.required)
        .filter((f) => !(f.id in input.content.fields));

      if (missingRequired.length > 0) {
        const labels = missingRequired.map((f) => f.label).join(", ");
        throw new ValidationError(`Campos obrigatórios ausentes: ${labels}`);
      }
    }

    return documentRepository.create({
      title: input.title,
      content: input.content,
      status: input.status,
      ...(input.clientId && { client: { connect: { id: input.clientId } } }),
      ...(input.projectId && {
        project: { connect: { id: input.projectId } },
      }),
      ...(input.environmentId && {
        environment: { connect: { id: input.environmentId } },
      }),
      ...(input.templateId && {
        template: { connect: { id: input.templateId } },
      }),
    });
  },

  async update(id: string, input: UpdateDocumentInput): Promise<DocumentRecord> {
    const existing = await documentRepository.findById(id);
    if (!existing) throw new NotFoundError("Documento");

    // Documentos aprovados não podem ser editados
    if (existing.status === "APPROVED") {
      throw new ValidationError("Documentos aprovados não podem ser editados");
    }

    return documentRepository.update(id, {
      ...(input.title && { title: input.title }),
      ...(input.content && { content: input.content }),
      ...(input.status && { status: input.status }),
      ...(input.environmentId !== undefined && {
        environmentId: input.environmentId,
      }),
    });
  },

  async delete(id: string): Promise<void> {
    const existing = await documentRepository.findById(id);
    if (!existing) throw new NotFoundError("Documento");
    await documentRepository.softDelete(id);
  },
};
