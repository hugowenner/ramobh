"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { toActionError, UnauthorizedError } from "@/core/errors";
import { pdfGenerationService } from "../services/pdf-generation.service";
import type { ActionResult } from "@/types";

type PdfActionData = {
  pdfId: string;
  downloadUrl: string;
  filename: string;
  sizeKb: number;
};

export async function generateDocumentPdfAction(
  documentId: string
): Promise<ActionResult<PdfActionData>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: new UnauthorizedError().message };
  }

  try {
    const result = await pdfGenerationService.generateForDocument(
      documentId,
      session.user.id
    );

    revalidatePath(`/documents/${documentId}`);

    return {
      success: true,
      data: {
        pdfId: result.id,
        downloadUrl: result.downloadUrl,
        filename: result.filename,
        sizeKb: Math.round(result.size / 1024),
      },
    };
  } catch (error) {
    return { success: false, error: toActionError(error) };
  }
}
