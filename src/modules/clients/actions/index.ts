"use server";

import { revalidatePath } from "next/cache";
import { toActionError } from "@/core/errors";
import { clientService } from "../services/client.service";
import {
  createClientSchema,
  updateClientSchema,
  listClientsSchema,
} from "../schemas";
import type { ActionResult, PaginatedResult } from "@/types";
import type { ClientRecord, ClientSummary } from "../types";

// ---------------------------------------------------------------------------
// Generic actions (programmatic use)
// ---------------------------------------------------------------------------

export async function listClients(
  raw: unknown
): Promise<ActionResult<PaginatedResult<ClientSummary>>> {
  const parsed = listClientsSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Parâmetros de busca inválidos" };
  }
  try {
    const data = await clientService.list(parsed.data);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toActionError(error) };
  }
}

export async function getClient(
  id: string
): Promise<ActionResult<ClientRecord>> {
  try {
    const data = await clientService.getById(id);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toActionError(error) };
  }
}

export async function deleteClient(id: string): Promise<ActionResult> {
  try {
    await clientService.delete(id);
    revalidatePath("/clients");
    revalidatePath(`/clients/${id}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: toActionError(error) };
  }
}

// ---------------------------------------------------------------------------
// Form-compatible actions (useActionState — FormData signature)
// ---------------------------------------------------------------------------

export type ClientFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export async function createClientAction(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const raw = {
    name: formData.get("name"),
    cnpj: formData.get("cnpj") || undefined,
    segment: formData.get("segment") || undefined,
    status: formData.get("status"),
    country: formData.get("country") || "BR",
    state: formData.get("state") || undefined,
    city: formData.get("city") || undefined,
    notes: formData.get("notes") || undefined,
  };

  const parsed = createClientSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    await clientService.create(parsed.data);
    revalidatePath("/clients");
    return { success: true };
  } catch (error) {
    return { error: toActionError(error) };
  }
}

export async function updateClientAction(
  id: string,
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const raw = {
    name: formData.get("name") || undefined,
    cnpj: formData.get("cnpj") || undefined,
    segment: formData.get("segment") || undefined,
    status: formData.get("status") || undefined,
    country: formData.get("country") || undefined,
    state: formData.get("state") || undefined,
    city: formData.get("city") || undefined,
    notes: formData.get("notes") || undefined,
  };

  const parsed = updateClientSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    await clientService.update(id, parsed.data);
    revalidatePath("/clients");
    revalidatePath(`/clients/${id}`);
    return { success: true };
  } catch (error) {
    return { error: toActionError(error) };
  }
}
