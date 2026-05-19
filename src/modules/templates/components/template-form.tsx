"use client";

import { useActionState, useState, useMemo, useEffect } from "react";
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
import { TemplateSchemaPreview } from "./template-schema-preview";
import { TEMPLATE_SCHEMA_PLACEHOLDER } from "../constants";
import { tryParseTemplateSchema } from "../services/template.parser";
import type { TemplateFormState } from "../actions";
import type { TemplateSchema } from "../types";

type SchemaParseResult =
  | { ok: true; schema: TemplateSchema }
  | { ok: false; error: string };

/** Decoupled from Prisma's Template to avoid JsonValue/TemplateSchema conflicts */
type TemplateFormDefaults = {
  id?: string;
  name?: string;
  description?: string | null;
  category?: string;
  isActive?: boolean;
  schema?: TemplateSchema;
};

type Props = {
  action: (
    prevState: TemplateFormState,
    formData: FormData
  ) => Promise<TemplateFormState>;
  categories: string[];
  defaultValues?: TemplateFormDefaults;
  redirectTo?: string;
  submitLabel?: string;
};

export function TemplateForm({
  action,
  categories,
  defaultValues,
  redirectTo = "/templates",
  submitLabel = "Salvar",
}: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, null);

  const isEdit = Boolean(defaultValues?.id);

  // JSON textarea state
  const [rawSchema, setRawSchema] = useState<string>(() => {
    if (defaultValues?.schema) {
      return JSON.stringify(defaultValues.schema, null, 2);
    }
    return TEMPLATE_SCHEMA_PLACEHOLDER;
  });

  // Try to parse schema in real-time — explicit type prevents discriminant widening
  const schemaParseResult = useMemo<SchemaParseResult>(() => {
    try {
      const json = JSON.parse(rawSchema);
      return tryParseTemplateSchema(json);
    } catch (e) {
      if (e instanceof SyntaxError) {
        return { ok: false as const, error: "JSON inválido — erro de sintaxe" };
      }
      return { ok: false as const, error: "Erro ao processar JSON" };
    }
  }, [rawSchema]);

  const parsedSchema: TemplateSchema | null = schemaParseResult.ok
    ? schemaParseResult.schema
    : null;

  useEffect(() => {
    if (state?.success) {
      toast.success(isEdit ? "Template atualizado" : "Template criado com sucesso");
      router.push(redirectTo);
    }
  }, [state, isEdit, redirectTo, router]);

  function fieldError(name: string) {
    return state?.fieldErrors?.[name]?.[0];
  }

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {/* Metadata section */}
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
            placeholder="Ex: Implantação SAP Business One"
            required
            aria-invalid={!!fieldError("name")}
            aria-describedby={fieldError("name") ? "name-error" : undefined}
          />
          {fieldError("name") && (
            <p id="name-error" className="text-xs text-destructive">
              {fieldError("name")}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label htmlFor="category">
            Categoria <span className="text-destructive">*</span>
          </Label>
          <Select
            name="category"
            defaultValue={defaultValues?.category ?? ""}
            required
          >
            <SelectTrigger
              id="category"
              aria-invalid={!!fieldError("category")}
            >
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldError("category") && (
            <p className="text-xs text-destructive">{fieldError("category")}</p>
          )}
        </div>

        {/* Active toggle */}
        <div className="space-y-1.5">
          <Label htmlFor="isActive">Status</Label>
          <select
            id="isActive"
            name="isActive"
            defaultValue={
              defaultValues?.isActive !== false ? "true" : "false"
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>

        {/* Description */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="description">
            Descrição <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={defaultValues?.description ?? ""}
            placeholder="Contexto e propósito deste template..."
            rows={3}
            required
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
      </div>

      {/* Schema editor + preview */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left: JSON editor */}
        <div className="space-y-1.5">
          <Label htmlFor="schema">
            Schema JSON <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="schema"
            name="schema"
            value={rawSchema}
            onChange={(e) => setRawSchema(e.target.value)}
            placeholder="Cole ou edite o schema JSON..."
            rows={16}
            className="font-mono text-xs"
            required
            aria-invalid={!!fieldError("schema") || !schemaParseResult.ok}
            aria-describedby={
              fieldError("schema") || !schemaParseResult.ok
                ? "schema-error"
                : undefined
            }
          />
          <div className="space-y-2">
            {(fieldError("schema") || !schemaParseResult.ok) && (
              <p
                id="schema-error"
                className="text-xs text-destructive font-medium"
              >
                {fieldError("schema") ??
                  (schemaParseResult.ok
                    ? "Schema válido"
                    : `Erro: ${schemaParseResult.error}`)}
              </p>
            )}
            {schemaParseResult.ok && !fieldError("schema") && (
              <p className="text-xs text-green-600 font-medium">
                ✓ Schema válido
              </p>
            )}
          </div>
        </div>

        {/* Right: Live preview */}
        <div className="space-y-1.5">
          <Label>Preview do Schema</Label>
          {parsedSchema ? (
            <div className="border rounded-md p-4 bg-muted/30 max-h-96 overflow-y-auto">
              <TemplateSchemaPreview schema={parsedSchema} />
            </div>
          ) : (
            <div className="border rounded-md p-4 bg-muted/30 text-sm text-muted-foreground">
              {schemaParseResult.ok
                ? "Nenhuma seção definida"
                : `Erro: ${schemaParseResult.error}`}
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending || !schemaParseResult.ok}>
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
