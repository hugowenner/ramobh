import { NotFoundError, ValidationError } from "@/core/errors";
import { storage } from "@/core/storage";
import { attachmentRepository } from "../repositories/attachment.repository";
import { documentRepository } from "@/modules/documents/repositories/document.repository";
import { ALLOWED_MIMETYPES } from "../schemas";
import type { UploadFileInput } from "../schemas";

const MAX_SIZE_BYTES =
  parseInt(process.env.MAX_UPLOAD_SIZE_MB ?? "50") * 1024 * 1024;

export const attachmentService = {
  async upload(
    file: { buffer: Buffer; originalName: string; mimetype: string; size: number },
    input: UploadFileInput
  ) {
    // Verifica que o documento existe
    const document = await documentRepository.findById(input.documentId);
    if (!document) throw new NotFoundError("Documento");

    // Valida tamanho
    if (file.size > MAX_SIZE_BYTES) {
      throw new ValidationError(
        `Arquivo excede o limite de ${process.env.MAX_UPLOAD_SIZE_MB ?? 50}MB`
      );
    }

    // Valida tipo
    if (!ALLOWED_MIMETYPES.includes(file.mimetype as never)) {
      throw new ValidationError("Tipo de arquivo não permitido");
    }

    const stored = await storage.save(
      file.buffer,
      file.originalName,
      `documents/${input.documentId}`
    );

    return attachmentRepository.create({
      name: file.originalName,
      filename: file.originalName,
      mimetype: file.mimetype,
      size: file.size,
      storagePath: stored.storagePath,
      storageType: stored.storageType,
      uploadedBy: input.uploadedBy ?? null,
      document: { connect: { id: input.documentId } },
    });
  },

  async delete(id: string): Promise<void> {
    const attachment = await attachmentRepository.findById(id);
    if (!attachment) throw new NotFoundError("Anexo");

    await storage.delete(attachment.storagePath);
    await attachmentRepository.delete(id);
  },

  async listByDocument(documentId: string) {
    const document = await documentRepository.findById(documentId);
    if (!document) throw new NotFoundError("Documento");
    return attachmentRepository.findByDocument(documentId);
  },
};
