"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientSelect } from "@/modules/clients/components/client-select";
import { ProjectStatus, ProjectType } from "@/generated/prisma";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_TYPE_LABELS,
  formatDateForInput,
} from "../utils/project";
import type { ProjectFormState } from "../actions";
import type { ProjectWithClient } from "../types";
import type { ClientOption } from "@/modules/clients/components/client-select";

type Props = {
  action: (
    prevState: ProjectFormState,
    formData: FormData
  ) => Promise<ProjectFormState>;
  clients: ClientOption[];
  defaultValues?: Partial<ProjectWithClient>;
  redirectTo?: string;
  submitLabel?: string;
};

export function ProjectForm({
  action,
  clients,
  defaultValues,
  redirectTo = "/projects",
  submitLabel = "Salvar",
}: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, null);

  const isEdit = Boolean(defaultValues?.id);

  useEffect(() => {
    if (state?.success) {
      toast.success(isEdit ? "Projeto atualizado" : "Projeto criado com sucesso");
      router.push(redirectTo);
    }
  }, [state, isEdit, redirectTo, router]);

  function fieldError(name: string) {
    return state?.fieldErrors?.[name]?.[0];
  }

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state?.error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Name */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="name">
            Nome <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={defaultValues?.name}
            placeholder="Nome do projeto"
            aria-invalid={!!fieldError("name")}
            aria-describedby={fieldError("name") ? "name-error" : undefined}
          />
          {fieldError("name") && (
            <p id="name-error" className="text-xs text-destructive">
              {fieldError("name")}
            </p>
          )}
        </div>

        {/* Client — disabled on edit (cliente não pode ser alterado) */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="clientId">
            Cliente <span className="text-destructive">*</span>
            {isEdit && (
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                (não pode ser alterado)
              </span>
            )}
          </Label>
          <ClientSelect
            clients={clients}
            defaultValue={defaultValues?.clientId}
            disabled={isEdit}
            required={!isEdit}
          />
          {fieldError("clientId") && (
            <p className="text-xs text-destructive">{fieldError("clientId")}</p>
          )}
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <Label htmlFor="type">
            Tipo <span className="text-destructive">*</span>
          </Label>
          <Select
            name="type"
            defaultValue={defaultValues?.type}
            required
          >
            <SelectTrigger
              id="type"
              aria-invalid={!!fieldError("type")}
            >
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ProjectType).map((t) => (
                <SelectItem key={t} value={t}>
                  {PROJECT_TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldError("type") && (
            <p className="text-xs text-destructive">{fieldError("type")}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            name="status"
            defaultValue={defaultValues?.status ?? ProjectStatus.PLANNING}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ProjectStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {PROJECT_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start date */}
        <div className="space-y-1.5">
          <Label htmlFor="startDate">Data de início</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={formatDateForInput(defaultValues?.startDate)}
          />
        </div>

        {/* End date */}
        <div className="space-y-1.5">
          <Label htmlFor="endDate">Previsão de término</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={formatDateForInput(defaultValues?.endDate)}
          />
        </div>

        {/* Description */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={defaultValues?.description ?? ""}
            placeholder="Objetivo, escopo e contexto do projeto..."
            rows={4}
            aria-invalid={!!fieldError("description")}
            aria-describedby={fieldError("description") ? "description-error" : undefined}
          />
          {fieldError("description") && (
            <p id="description-error" className="text-xs text-destructive">
              {fieldError("description")}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(redirectTo)}
          disabled={isPending}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
