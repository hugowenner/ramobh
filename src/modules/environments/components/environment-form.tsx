"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
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
import { ProjectSelect } from "@/modules/projects/components/project-select";
import { getProjectOptionsByClient } from "@/modules/projects/actions";
import { EnvironmentType } from "@/generated/prisma";
import { ENVIRONMENT_TYPE_LABELS } from "../utils/environment";
import type { EnvironmentFormState } from "../actions";
import type { EnvironmentWithRelations } from "../types";
import type { ClientOption } from "@/modules/clients/components/client-select";
import type { ProjectOption } from "@/modules/projects/components/project-select";

type Props = {
  action: (
    prevState: EnvironmentFormState,
    formData: FormData
  ) => Promise<EnvironmentFormState>;
  clients: ClientOption[];
  initialProjects: ProjectOption[];
  defaultValues?: Partial<EnvironmentWithRelations>;
  redirectTo?: string;
  submitLabel?: string;
};

export function EnvironmentForm({
  action,
  clients,
  initialProjects,
  defaultValues,
  redirectTo = "/environments",
  submitLabel = "Salvar",
}: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, null);

  const isEdit = Boolean(defaultValues?.id);

  const [selectedClientId, setSelectedClientId] = useState(
    defaultValues?.clientId ?? ""
  );
  const [projectOptions, setProjectOptions] =
    useState<ProjectOption[]>(initialProjects);
  const [projectSelectKey, setProjectSelectKey] = useState(0);
  const [, startProjectsTransition] = useTransition();

  useEffect(() => {
    if (state?.success) {
      toast.success(isEdit ? "Ambiente atualizado" : "Ambiente criado com sucesso");
      router.push(redirectTo);
    }
  }, [state, isEdit, redirectTo, router]);

  function handleClientChange(clientId: string) {
    setSelectedClientId(clientId);
    setProjectOptions([]);
    setProjectSelectKey((k) => k + 1); // reset ProjectSelect value
    if (clientId) {
      startProjectsTransition(async () => {
        const opts = await getProjectOptionsByClient(clientId);
        setProjectOptions(opts);
      });
    }
  }

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
            placeholder="Ex: Produção SAP B1 Cliente XYZ"
            aria-invalid={!!fieldError("name")}
            aria-describedby={fieldError("name") ? "name-error" : undefined}
          />
          {fieldError("name") && (
            <p id="name-error" className="text-xs text-destructive">
              {fieldError("name")}
            </p>
          )}
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <Label htmlFor="type">
            Tipo <span className="text-destructive">*</span>
          </Label>
          <Select name="type" defaultValue={defaultValues?.type} required>
            <SelectTrigger id="type" aria-invalid={!!fieldError("type")}>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(EnvironmentType).map((t) => (
                <SelectItem key={t} value={t}>
                  {ENVIRONMENT_TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldError("type") && (
            <p className="text-xs text-destructive">{fieldError("type")}</p>
          )}
        </div>

        {/* Version */}
        <div className="space-y-1.5">
          <Label htmlFor="version">Versão</Label>
          <Input
            id="version"
            name="version"
            defaultValue={defaultValues?.version ?? ""}
            placeholder="Ex: 10.0, 2023 FPS01"
          />
        </div>

        {/* Client — disabled on edit */}
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
            value={!isEdit ? selectedClientId : undefined}
            onValueChange={!isEdit ? handleClientChange : undefined}
            defaultValue={isEdit ? selectedClientId : undefined}
            disabled={isEdit}
            required={!isEdit}
          />
          {fieldError("clientId") && (
            <p className="text-xs text-destructive">{fieldError("clientId")}</p>
          )}
        </div>

        {/* Project — optional, depends on client */}
        {(selectedClientId || projectOptions.length > 0) && (
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="projectId">Projeto</Label>
            <ProjectSelect
              key={projectSelectKey}
              projects={projectOptions}
              defaultValue={defaultValues?.projectId ?? ""}
            />
            {fieldError("projectId") && (
              <p className="text-xs text-destructive">
                {fieldError("projectId")}
              </p>
            )}
          </div>
        )}

        {/* URL */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            name="url"
            type="url"
            defaultValue={defaultValues?.url ?? ""}
            placeholder="https://servidor:porta"
            aria-invalid={!!fieldError("url")}
            aria-describedby={fieldError("url") ? "url-error" : undefined}
          />
          {fieldError("url") && (
            <p id="url-error" className="text-xs text-destructive">
              {fieldError("url")}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={defaultValues?.description ?? ""}
            placeholder="Contexto do ambiente, responsáveis, etc."
            rows={3}
            aria-invalid={!!fieldError("description")}
            aria-describedby={
              fieldError("description") ? "description-error" : undefined
            }
          />
          {fieldError("description") && (
            <p id="description-error" className="text-xs text-destructive">
              {fieldError("description")}
            </p>
          )}
        </div>

        {/* Notes */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="notes">Notas técnicas</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={defaultValues?.notes ?? ""}
            placeholder="Credenciais de acesso, configurações específicas, licenças..."
            rows={4}
          />
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
