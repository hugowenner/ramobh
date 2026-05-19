"use server";

import { revalidatePath } from "next/cache";
import { toActionError } from "@/core/errors";
import { documentService } from "../services/document.service";
import type { DocumentStatus } from "@/generated/prisma";
import type { ActionResult } from "@/types";

export async function updateDocumentStatus(
  id: string,
  status: DocumentStatus
): Promise<ActionResult> {
  try {
    await documentService.updateStatus(id, { status });
    revalidatePath("/documents");
    revalidatePath(`/documents/${id}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: toActionError(error) };
  }
}
