"use client";

import {
  useActionState,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  getEnvironmentOptionsByClient,
} from "@/modules/environments/actions";
import { getTemplateSchemaAction } from "../actions";
import { DynamicDocumentForm } from "./dynamic-document-form";
import type { ClientOption } from "@/modules/clients/components/client-select";
import type { ProjectOption } from "@/modules/projects/components/project-select";
import type { EnvironmentOption } from "@/modules/environments/actions";
import type { TemplateSchema } from "@/modules/templates/types";
import type { DocumentEditDefaults } from "../types";
import type { DocumentFormState } from "../actions";

// ── Types ─────────────────────────────────────────────────────

export type TemplateOption = {
  id: string;
  name: string;
  category: string;
};

type Props = {
  action: (
    prevState: DocumentFormState,
    formData: FormData
  ) => Promise<DocumentFormState>;
  clients: ClientOption[];
  initialProjects: ProjectOption[];
  initialEnvironments: EnvironmentOption[];
  /** Create mode — templates to choose from */
  templates?: TemplateOption[];
  /** Edit mode — pre-populated form */
  defaultValues?: DocumentEditDefaults;
  redirectTo?: string;
  submitLabel?: string;
};

// ── Component ─────────────────────────────────────────────────

export function DocumentForm({
  action,
  clients,
  initialProjects,
  initialEnvironments,
  templates,
  defaultValues,
  redirectTo = "/documents",
  submitLabel = "Salvar",
}: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, null);

  const isEdit = Boolean(defaultValues?.id);

  // ── Schema state (create mode: loaded on template select) ──
  const [loadedSchema, setLoadedSchema] = useState<TemplateSchema | null>(null);
  const [schemaError, setSchemaError] = useState<string | null>(null);
  // Key changes when template changes — resets DynamicDocumentForm state
  const [dynamicFormKey, setDynamicFormKey] = useState(0);
  const [isLoadingSchema, startSchemaTransition] = useTransition();

  // ── Client / project / environment cascade ─────────────────
  // undefined = "nothing selected" — single canonical absence value
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(
    defaultValues?.clientId ?? undefined
  );
  const [projectOptions, setProjectOptions] =
    useState<ProjectOption[]>(initialProjects);
  const [environmentOptions, setEnvironmentOptions] =
    useState<EnvironmentOption[]>(initialEnvironments);
  const [projectSelectKey, setProjectSelectKey] = useState(0);
  const [envSelectKey, setEnvSelectKey] = useState(0);
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<
    string | undefined
  >(defaultValues?.environmentId ?? undefined);
  const [, startRelationsTransition] = useTransition();

  // Effective schema — edit mode uses the snapshot, create mode uses loaded
  const effectiveSchema: TemplateSchema | null = isEdit
    ? defaultValues!.schemaSnapshot
    : loadedSchema;

  // ── Handlers ──────────────────────────────────────────────

  function handleTemplateChange(templateId: string) {
    setLoadedSchema(null);
    setSchemaError(null);
    setDynamicFormKey((k) => k + 1);
    if (!templateId) return;

    startSchemaTransition(async () => {
      const result = await getTemplateSchemaAction(templateId);
      if (result.success) {
        setLoadedSchema(result.data);
      } else {
        setSchemaError(result.error ?? "Erro ao carregar schema do template");
      }
    });
  }

  function handleClientChange(clientId: string) {
    setSelectedClientId(clientId);
    setProjectOptions([]);
    setEnvironmentOptions([]);
    setProjectSelectKey((k) => k + 1);
    setEnvSelectKey((k) => k + 1);
    setSelectedEnvironmentId(undefined);

    if (!clientId) return;

    startRelationsTransition(async () => {
      const [projects, envs] = await Promise.all([
        getProjectOptionsByClient(clientId),
        getEnvironmentOptionsByClient(clientId),
      ]);
      setProjectOptions(projects);
      setEnvironmentOptions(envs);
    });
  }

  // ── Redirect on success ───────────────────────────────────

  useEffect(() => {
    if (!state?.success) return;
    toast.success(isEdit ? "Documento atualizado" : "Documento criado com sucesso");
    // For create: redirect to the new document detail if id is available
    const destination =
      !isEdit && state.documentId
        ? `/documents/${state.documentId}`
        : redirectTo;
    router.push(destination);
  }, [state, isEdit, redirectTo, router]);

  // ── Field error helper ────────────────────────────────────

  function fieldError(name: string): string | undefined {
    return state?.fieldErrors?.[name]?.[0];
  }

  // ── Render ────────────────────────────────────────────────

  return (
    <form action={formAction} className="space-y-8">
      {/* Global error */}
      {state?.error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {/* ── Static fields ─────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Title */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="title">
            Título <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            defaultValue={defaultValues?.title}
            placeholder="Ex: Troubleshooting — Login lento ACME Produção"
            required
            aria-invalid={!!fieldError("title")}
          />
          {fieldError("title") && (
            <p className="text-xs text-destructive">{fieldError("title")}</p>
          )}
        </div>

        {/* Template — create mode: selector / edit mode: hidden + label */}
        {isEdit ? (
          <input type="hidden" name="templateId" value={defaultValues!.templateId} />
        ) : (
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="templateId">
              Template <span className="text-destructive">*</span>
            </Label>
            <Select
              name="templateId"
              onValueChange={handleTemplateChange}
              required
            >
              <SelectTrigger id="templateId" aria-invalid={!!fieldError("templateId")}>
                <SelectValue placeholder="Selecione o template" />
              </SelectTrigger>
              <SelectContent>
                {(templates ?? []).map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    <span className="mr-2 text-muted-foreground text-xs">
                      [{t.category}]
                    </span>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError("templateId") && (
              <p className="text-xs text-destructive">{fieldError("templateId")}</p>
            )}
            {schemaError && (
              <p className="text-xs text-destructive">{schemaError}</p>
            )}
            {isLoadingSchema && (
              <p className="text-xs text-muted-foreground">
                Carregando campos do template...
              </p>
            )}
          </div>
        )}

        {/* Client (optional, controlled for cascade) */}
        <div className="space-y-1.5">
          <Label htmlFor="clientId">Cliente</Label>
          <ClientSelect
            clients={clients}
            value={selectedClientId}
            onValueChange={handleClientChange}
            placeholder="Nenhum (opcional)"
          />
          {fieldError("clientId") && (
            <p className="text-xs text-destructive">{fieldError("clientId")}</p>
          )}
        </div>

        {/* Project (optional) */}
        <div className="space-y-1.5">
          <Label htmlFor="projectId">Projeto</Label>
          <ProjectSelect
            key={projectSelectKey}
            projects={projectOptions}
            defaultValue={defaultValues?.projectId ?? ""}
            placeholder="Nenhum (opcional)"
          />
          {fieldError("projectId") && (
            <p className="text-xs text-destructive">{fieldError("projectId")}</p>
          )}
        </div>

        {/* Environment (optional) */}
        <div className="space-y-1.5">
          <Label htmlFor="environmentId">Ambiente</Label>
          {/* Carries normalised value to the action: "" when nothing selected */}
          <input
            type="hidden"
            name="environmentId"
            value={selectedEnvironmentId ?? ""}
          />
          <div className="flex items-center gap-1">
            <Select
              key={envSelectKey}
              value={selectedEnvironmentId}
              onValueChange={setSelectedEnvironmentId}
            >
              <SelectTrigger id="environmentId" className="flex-1">
                <SelectValue placeholder="Nenhum (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {environmentOptions.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedEnvironmentId && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={() => setSelectedEnvironmentId(undefined)}
                aria-label="Limpar ambiente selecionado"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {fieldError("environmentId") && (
            <p className="text-xs text-destructive">{fieldError("environmentId")}</p>
          )}
        </div>
      </div>

      {/* ── Dynamic template fields ────────────────────────── */}
      {effectiveSchema ? (
        <div className="rounded-md border p-4 space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Campos do documento
          </h2>
          <DynamicDocumentForm
            key={dynamicFormKey}
            schema={effectiveSchema}
            defaultData={defaultValues?.data}
          />
        </div>
      ) : (
        !isEdit && (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            Selecione um template para exibir os campos do documento
          </div>
        )
      )}

      {/* ── Buttons ────────────────────────────────────────── */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isPending || (!isEdit && !effectiveSchema)}
        >
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
