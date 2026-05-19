"use server";

import { revalidatePath } from "next/cache";
import { toActionError } from "@/core/errors";
import { templateService } from "../services/template.service";
import type { ActionResult } from "@/types";

export async function deleteTemplate(id: string): Promise<ActionResult> {
  try {
    await templateService.deleteTemplate(id);
    revalidatePath("/templates");
    revalidatePath(`/templates/${id}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: toActionError(error) };
  }
}
