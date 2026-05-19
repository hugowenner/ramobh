"use server";

import { revalidatePath } from "next/cache";
import { toActionError } from "@/core/errors";
import { projectService } from "../services/project.service";
import { updateProjectSchema, createProjectSchema } from "../schemas";
import type { ActionResult } from "@/types";

export type ProjectFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await projectService.delete(id);
    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: toActionError(error) };
  }
}

export async function createProjectAction(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const raw = {
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    type: formData.get("type"),
    status: formData.get("status"),
    startDate: formData.get("startDate") || undefined,
    endDate: formData.get("endDate") || undefined,
    clientId: formData.get("clientId"),
  };

  const parsed = createProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    await projectService.create(parsed.data);
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    return { error: toActionError(error) };
  }
}

export async function updateProjectAction(
  id: string,
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const raw = {
    name: formData.get("name") || undefined,
    description: formData.get("description") || undefined,
    type: formData.get("type") || undefined,
    status: formData.get("status") || undefined,
    startDate: formData.get("startDate") || undefined,
    endDate: formData.get("endDate") || undefined,
  };

  const parsed = updateProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    await projectService.update(id, parsed.data);
    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);
    return { success: true };
  } catch (error) {
    return { error: toActionError(error) };
  }
}
