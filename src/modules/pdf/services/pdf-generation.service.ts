/**
 * server-only — never import this in client components.
 */
import { prisma } from "@/core/database/client";
import { storage } from "@/core/storage";
import { documentService } from "@/modules/documents/services/document.service";
import { DOCUMENT_STATUS_LABELS } from "@/modules/documents/constants";
import { generateDocumentPdf } from "../generators/document-pdf-generator";
import type { DocumentDetail } from "@/modules/documents/types";
import type { DocumentPdfData, PdfGenerationResult } from "../types";

// ── Mapper: DocumentDetail → DocumentPdfData ───────────────────

function buildPdfData(doc: DocumentDetail, generatedAt: Date): DocumentPdfData {
  return {
    id: doc.id,
    title: doc.title,
    templateVersion: doc.templateVersion,
    documentVersion: doc.updatedAt.toISOString(),
    generatedAt,
    schemaSnapshot: doc.schemaSnapshot,
    data: doc.data,
    status: DOCUMENT_STATUS_LABELS[doc.status],
    template: doc.template,
    client: doc.client,
    project: doc.project,
    environment: doc.environment,
    createdBy: doc.createdBy,
    createdAt: doc.createdAt,
  };
}

// ── Service ────────────────────────────────────────────────────

export const pdfGenerationService = {
  /**
   * Full generation pipeline:
   * 1. Load document (always from DB — uses schemaSnapshot, never current template)
   * 2. Build typed DocumentPdfData
   * 3. Render to Buffer via @react-pdf/renderer
   * 4. Persist to local storage under uploads/generated-pdfs/
   * 5. Record GeneratedPdf row in DB
   *
   * Returns enough info for the action to build a download URL.
   */
  async generateForDocument(
    documentId: string,
    generatedById?: string
  ): Promise<PdfGenerationResult> {
    const doc = await documentService.getById(documentId);
    const generatedAt = new Date();
    const pdfData = buildPdfData(doc, generatedAt);

    // ── Render ──────────────────────────────────────────────
    const buffer = await generateDocumentPdf(pdfData);

    // ── Store ───────────────────────────────────────────────
    // Filename: sanitised title + documentId slice for uniqueness
    const safeTitle = doc.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 48);
    const filename = `${safeTitle}-${doc.id.slice(-8)}.pdf`;

    const stored = await storage.save(buffer, filename, "generated-pdfs");

    // ── Persist ─────────────────────────────────────────────
    const record = await prisma.generatedPdf.create({
      data: {
        documentId,
        storagePath: stored.storagePath,
        filename,
        size: buffer.length,
        mimeType: "application/pdf",
        templateVersion: doc.templateVersion,
        documentVersion: doc.updatedAt.toISOString(),
        generatedAt,
        ...(generatedById && { generatedById }),
      },
      select: {
        id: true,
        storagePath: true,
        filename: true,
        size: true,
      },
    });

    return {
      id: record.id,
      storagePath: record.storagePath,
      filename: record.filename,
      size: record.size,
      downloadUrl: `/api/documents/${documentId}/pdf`,
    };
  },

  /** Returns the most recently generated PDF for a document, or null. */
  async getLatestForDocument(documentId: string) {
    return prisma.generatedPdf.findFirst({
      where: { documentId },
      orderBy: { generatedAt: "desc" },
      select: {
        id: true,
        filename: true,
        size: true,
        templateVersion: true,
        documentVersion: true,
        generatedAt: true,
        storagePath: true,
      },
    });
  },

  /** Returns all generated PDFs for a document, ordered newest-first. */
  async listForDocument(documentId: string) {
    return prisma.generatedPdf.findMany({
      where: { documentId },
      orderBy: { generatedAt: "desc" },
      select: {
        id: true,
        filename: true,
        size: true,
        templateVersion: true,
        documentVersion: true,
        generatedAt: true,
      },
    });
  },
};
