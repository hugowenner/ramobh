"use server";

import { revalidatePath } from "next/cache";
import { toActionError } from "@/core/errors";
import { environmentService } from "../services/environment.service";
import { createEnvironmentSchema, updateEnvironmentSchema } from "../schemas";
import type { ActionResult } from "@/types";

export type EnvironmentFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export async function deleteEnvironment(id: string): Promise<ActionResult> {
  try {
    await environmentService.delete(id);
    revalidatePath("/environments");
    revalidatePath(`/environments/${id}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: toActionError(error) };
  }
}

export async function createEnvironmentAction(
  _prevState: EnvironmentFormState,
  formData: FormData
): Promise<EnvironmentFormState> {
  const rawProjectId = formData.get("projectId") as string | null;

  const raw = {
    name: formData.get("name"),
    type: formData.get("type"),
    description: formData.get("description") || undefined,
    clientId: formData.get("clientId"),
    // "" = "no project" → undefined
    projectId: rawProjectId && rawProjectId.length > 0 ? rawProjectId : undefined,
    url: formData.get("url") || undefined,
    version: formData.get("version") || undefined,
    notes: formData.get("notes") || undefined,
  };

  const parsed = createEnvironmentSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await environmentService.create(parsed.data);
    revalidatePath("/environments");
    return { success: true };
  } catch (error) {
    return { error: toActionError(error) };
  }
}

// ── Read helpers ─────────────────────────────────────────────

export type EnvironmentOption = {
  id: string;
  name: string;
  clientId: string;
  projectId: string | null;
};

export async function getEnvironmentOptionsByClient(
  clientId: string
): Promise<EnvironmentOption[]> {
  if (!clientId) return [];
  try {
    const result = await environmentService.list({
      clientId,
      page: 1,
      limit: 100,
    });
    return result.data.map((e) => ({
      id: e.id,
      name: e.name,
      clientId: e.clientId,
      projectId: e.projectId ?? null,
    }));
  } catch {
    return [];
  }
}

export async function updateEnvironmentAction(
  id: string,
  _prevState: EnvironmentFormState,
  formData: FormData
): Promise<EnvironmentFormState> {
  const rawProjectId = formData.get("projectId") as string | null;

  const raw = {
    name: formData.get("name") || undefined,
    type: formData.get("type") || undefined,
    description: formData.get("description") || undefined,
    url: formData.get("url") || undefined,
    version: formData.get("version") || undefined,
    notes: formData.get("notes") || undefined,
    // "" = user selected "Nenhum" → treat as undefined (no change for now)
    projectId: rawProjectId && rawProjectId.length > 0 ? rawProjectId : undefined,
  };

  const parsed = updateEnvironmentSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await environmentService.update(id, parsed.data);
    revalidatePath("/environments");
    revalidatePath(`/environments/${id}`);
    return { success: true };
  } catch (error) {
    return { error: toActionError(error) };
  }
}
