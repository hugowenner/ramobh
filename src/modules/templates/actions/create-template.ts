"use server";

import { revalidatePath } from "next/cache";
import { toActionError } from "@/core/errors";
import { templateService } from "../services/template.service";
import { createTemplateSchema } from "../schemas";
import { tryParseTemplateSchema } from "../services/template.parser";
import type { TemplateFormState } from "./types";

export async function createTemplateAction(
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

  const descriptionValue = formData.get("description");
  const raw = {
    name: formData.get("name"),
    description:
      typeof descriptionValue === "string" ? descriptionValue : "",
    category: formData.get("category"),
    schema: schemaResult.schema,
    isActive: formData.get("isActive") !== "false",
  };

  const parsed = createTemplateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const created = await templateService.createTemplate(parsed.data);
    revalidatePath("/templates");
    revalidatePath(`/templates/${created.id}`);
    return { success: true };
  } catch (error) {
    return { error: toActionError(error) };
  }
}
