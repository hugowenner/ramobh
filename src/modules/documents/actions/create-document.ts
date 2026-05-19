"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { toActionError } from "@/core/errors";
import { UnauthorizedError } from "@/core/errors";
import { documentService } from "../services/document.service";
import { createDocumentSchema } from "../schemas";
import type { DocumentFormState } from "./types";

export async function createDocumentAction(
  _prevState: DocumentFormState,
  formData: FormData
): Promise<DocumentFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: new UnauthorizedError().message };
  }

  // Parse relation ids (empty string → null)
  function optId(key: string): string | null {
    const v = formData.get(key);
    return typeof v === "string" && v.length > 0 ? v : null;
  }

  // data is submitted as JSON string from the client component
  let data: Record<string, unknown> = {};
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
    title: formData.get("title"),
    templateId: formData.get("templateId"),
    data,
    status: "DRAFT",
    clientId: optId("clientId"),
    projectId: optId("projectId"),
    environmentId: optId("environmentId"),
  };

  const parsed = createDocumentSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const created = await documentService.create(parsed.data, session.user.id);
    revalidatePath("/documents");
    revalidatePath(`/documents/${created.id}`);
    return { success: true, documentId: created.id };
  } catch (error) {
    return { error: toActionError(error) };
  }
}
