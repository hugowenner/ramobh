"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EnvironmentType } from "@/generated/prisma";
import { ENVIRONMENT_TYPE_LABELS } from "../utils/environment";
import { getProjectOptionsByClient } from "@/modules/projects/actions";
import { useDebouncedCallback } from "use-debounce";
import type { ClientOption } from "@/modules/clients/components/client-select";
import type { ProjectOption } from "@/modules/projects/components/project-select";

const TYPE_OPTIONS = Object.values(EnvironmentType).map((t) => ({
  value: t,
  label: ENVIRONMENT_TYPE_LABELS[t],
}));

type Props = {
  clients: ClientOption[];
  initialProjects: ProjectOption[];
  defaultSearch?: string;
  defaultType?: string;
  defaultClientId?: string;
  defaultProjectId?: string;
};

export function EnvironmentFilters({
  clients,
  initialProjects,
  defaultSearch = "",
  defaultType = "",
  defaultClientId = "",
  defaultProjectId = "",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [projectOptions, setProjectOptions] =
    useState<ProjectOption[]>(initialProjects);
  const [, startProjectsTransition] = useTransition();

  const push = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleSearch = useDebouncedCallback(
    (value: string) => push({ search: value }),
    400
  );

  function handleClientChange(clientId: string) {
    push({ clientId, projectId: "" });
    setProjectOptions([]);
    if (clientId) {
      startProjectsTransition(async () => {
        const opts = await getProjectOptionsByClient(clientId);
        setProjectOptions(opts);
      });
    }
  }

  // undefined = "no filter active" — single canonical absence value
  const activeType: string | undefined = defaultType || undefined;
  const activeClientId: string | undefined = defaultClientId || undefined;
  const activeProjectId: string | undefined = defaultProjectId || undefined;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <Input
        placeholder="Buscar por ambiente, cliente ou projeto..."
        defaultValue={defaultSearch}
        onChange={(e) => handleSearch(e.target.value)}
        className="sm:max-w-xs"
      />

      <div className="flex items-center gap-1">
        <Select
          value={activeType}
          onValueChange={(v) => push({ type: v })}
        >
          <SelectTrigger className="sm:w-[180px]">
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {activeType && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => push({ type: "" })}
            aria-label="Limpar filtro de tipo"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Select
          value={activeClientId}
          onValueChange={handleClientChange}
        >
          <SelectTrigger className="sm:w-[200px]">
            <SelectValue placeholder="Todos os clientes" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {activeClientId && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => handleClientChange("")}
            aria-label="Limpar filtro de cliente"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filtro de projeto aparece quando há cliente selecionado */}
      {(activeClientId || projectOptions.length > 0) && (
        <div className="flex items-center gap-1">
          <Select
            value={activeProjectId}
            onValueChange={(v) => push({ projectId: v })}
          >
            <SelectTrigger className="sm:w-[200px]">
              <SelectValue placeholder="Todos os projetos" />
            </SelectTrigger>
            <SelectContent>
              {projectOptions.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {activeProjectId && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => push({ projectId: "" })}
              aria-label="Limpar filtro de projeto"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
