"use server";

import { revalidatePath } from "next/cache";
import { toActionError } from "@/core/errors";
import { templateService } from "../services/template.service";
import { updateTemplateSchema } from "../schemas";
import { tryParseTemplateSchema } from "../services/template.parser";
import type { TemplateFormState } from "./types";

export async function updateTemplateAction(
  id: string,
  _prevState: TemplateFormState,
  formData: FormData
): Promise<TemplateFormState> {
  const rawSchema = formData.get("schema");

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(typeof rawSchema === "string" ? rawSchema : "");
  } catch {
    return { fieldErrors: { schema: ["JSON invalido — verifique a sintaxe"] } };
  }

  const schemaResult = tryParseTemplateSchema(parsedJson);
  if (!schemaResult.ok) {
    return { fieldErrors: { schema: [schemaResult.error] } };
  }

  const raw = {
    name: formData.get("name"),
    description:
      typeof formData.get("description") === "string"
        ? formData.get("description")
        : "",
    category: formData.get("category"),
    schema: schemaResult.schema,
    isActive: formData.get("isActive") !== "false",
  };

  const parsed = updateTemplateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await templateService.updateTemplate(id, parsed.data);
    revalidatePath("/templates");
    revalidatePath(`/templates/${id}`);
    return { success: true };
  } catch (error) {
    return { error: toActionError(error) };
  }
}
