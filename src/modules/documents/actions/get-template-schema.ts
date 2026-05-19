"use server";

import { toActionError } from "@/core/errors";
import { templateService } from "@/modules/templates/services/template.service";
import type { TemplateSchema } from "@/modules/templates/types";
import type { ActionResult } from "@/types";

/**
 * Fetches the schema of an active template by id.
 * Called from the client when the user selects a template while creating a document.
 * Returns the TemplateSchema so the DynamicDocumentForm can render the right fields.
 */
export async function getTemplateSchemaAction(
  templateId: string
): Promise<ActionResult<TemplateSchema>> {
  try {
    const schema = await templateService.getTemplateSchema(templateId);
    return { success: true, data: schema };
  } catch (error) {
    return { success: false, error: toActionError(error) };
  }
}
