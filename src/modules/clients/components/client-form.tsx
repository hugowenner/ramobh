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
import { ClientStatus } from "@/generated/prisma";
import type { ClientFormState } from "../actions";
import type { ClientRecord } from "../types";

const STATUS_OPTIONS = [
  { value: ClientStatus.ACTIVE, label: "Ativo" },
  { value: ClientStatus.INACTIVE, label: "Inativo" },
  { value: ClientStatus.PROSPECT, label: "Prospecto" },
];

type Props = {
  action: (
    prevState: ClientFormState,
    formData: FormData
  ) => Promise<ClientFormState>;
  defaultValues?: Partial<ClientRecord>;
  redirectTo?: string;
  submitLabel?: string;
};

export function ClientForm({
  action,
  defaultValues,
  redirectTo = "/clients",
  submitLabel = "Salvar",
}: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, null);

  const isEdit = Boolean(defaultValues?.id);

  useEffect(() => {
    if (state?.success) {
      toast.success(isEdit ? "Cliente atualizado" : "Cliente criado com sucesso");
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
            placeholder="Razão social ou nome fantasia"
            aria-invalid={!!fieldError("name")}
            aria-describedby={fieldError("name") ? "name-error" : undefined}
          />
          {fieldError("name") && (
            <p id="name-error" className="text-xs text-destructive">
              {fieldError("name")}
            </p>
          )}
        </div>

        {/* CNPJ */}
        <div className="space-y-1.5">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            name="cnpj"
            defaultValue={defaultValues?.cnpj ?? ""}
            placeholder="00000000000000"
            maxLength={14}
            aria-invalid={!!fieldError("cnpj")}
            aria-describedby={fieldError("cnpj") ? "cnpj-error" : undefined}
          />
          {fieldError("cnpj") && (
            <p id="cnpj-error" className="text-xs text-destructive">
              {fieldError("cnpj")}
            </p>
          )}
        </div>

        {/* Segment */}
        <div className="space-y-1.5">
          <Label htmlFor="segment">Segmento</Label>
          <Input
            id="segment"
            name="segment"
            defaultValue={defaultValues?.segment ?? ""}
            placeholder="Ex: Varejo, Indústria, Serviços"
            aria-invalid={!!fieldError("segment")}
            aria-describedby={fieldError("segment") ? "segment-error" : undefined}
          />
          {fieldError("segment") && (
            <p id="segment-error" className="text-xs text-destructive">
              {fieldError("segment")}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            name="status"
            defaultValue={defaultValues?.status ?? ClientStatus.ACTIVE}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Country */}
        <div className="space-y-1.5">
          <Label htmlFor="country">País</Label>
          <Input
            id="country"
            name="country"
            defaultValue={defaultValues?.country ?? "BR"}
            placeholder="BR"
            maxLength={2}
            aria-invalid={!!fieldError("country")}
            aria-describedby={fieldError("country") ? "country-error" : undefined}
          />
          {fieldError("country") && (
            <p id="country-error" className="text-xs text-destructive">
              {fieldError("country")}
            </p>
          )}
        </div>

        {/* State */}
        <div className="space-y-1.5">
          <Label htmlFor="state">Estado (UF)</Label>
          <Input
            id="state"
            name="state"
            defaultValue={defaultValues?.state ?? ""}
            placeholder="Ex: SP"
            maxLength={50}
          />
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            name="city"
            defaultValue={defaultValues?.city ?? ""}
            placeholder="Ex: São Paulo"
          />
        </div>

        {/* Notes */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={defaultValues?.notes ?? ""}
            placeholder="Informações adicionais sobre o cliente..."
            rows={4}
            aria-invalid={!!fieldError("notes")}
            aria-describedby={fieldError("notes") ? "notes-error" : undefined}
          />
          {fieldError("notes") && (
            <p id="notes-error" className="text-xs text-destructive">
              {fieldError("notes")}
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
