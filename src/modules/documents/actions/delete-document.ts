"use server";

import { revalidatePath } from "next/cache";
import { toActionError } from "@/core/errors";
import { documentService } from "../services/document.service";
import type { ActionResult } from "@/types";

export async function deleteDocument(id: string): Promise<ActionResult> {
  try {
    await documentService.delete(id);
    revalidatePath("/documents");
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: toActionError(error) };
  }
}
