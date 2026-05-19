"use server";

import { revalidatePath } from "next/cache";
import { toActionError } from "@/core/errors";
import { documentService } from "../services/document.service";
import { updateDocumentSchema } from "../schemas";
import type { DocumentFormState } from "./types";

export async function updateDocumentAction(
  id: string,
  _prevState: DocumentFormState,
  formData: FormData
): Promise<DocumentFormState> {
  function optId(key: string): string | null | undefined {
    const v = formData.get(key);
    if (v === null) return undefined;             // field not in form — no-op
    if (typeof v === "string" && v.length === 0) return null; // explicit clear
    return v as string;
  }

  // data submitted as JSON string from the DynamicDocumentForm client component
  let data: Record<string, unknown> | undefined;
  const rawData = formData.get("data");
  if (typeof rawData === "string" && rawData.length > 0) {
    try {
      const parsed = JSON.parse(rawData);
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        data = parsed as Record<string, unknown>;
      }
    } catch {
      return { error: "Dados do formulário inválidos" };
    }
  }

  const raw = {
    title: formData.get("title") ?? undefined,
    data,
    clientId: optId("clientId"),
    projectId: optId("projectId"),
    environmentId: optId("environmentId"),
  };

  const parsed = updateDocumentSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await documentService.update(id, parsed.data);
    revalidatePath("/documents");
    revalidatePath(`/documents/${id}`);
    return { success: true };
  } catch (error) {
    return { error: toActionError(error) };
  }
}
