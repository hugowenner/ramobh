"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
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

const TYPE_OPTIONS = [
  { value: "ALL", label: "Todos os tipos" },
  ...Object.values(EnvironmentType).map((t) => ({
    value: t,
    label: ENVIRONMENT_TYPE_LABELS[t],
  })),
];

type Props = {
  clients: ClientOption[];
  initialProjects: ProjectOption[]; // projects para o clientId ativo nos URL params
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
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>(initialProjects);
  const [, startProjectsTransition] = useTransition();

  const push = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value && value !== "ALL") {
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
    push({ clientId, projectId: "" }); // limpa project ao trocar cliente
    setProjectOptions([]);
    if (clientId && clientId !== "ALL") {
      startProjectsTransition(async () => {
        const opts = await getProjectOptionsByClient(clientId);
        setProjectOptions(opts);
      });
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <Input
        placeholder="Buscar por ambiente, cliente ou projeto..."
        defaultValue={defaultSearch}
        onChange={(e) => handleSearch(e.target.value)}
        className="sm:max-w-xs"
      />
      <Select
        defaultValue={defaultType || "ALL"}
        onValueChange={(v) => push({ type: v })}
      >
        <SelectTrigger className="sm:w-[180px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          {TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={defaultClientId || "ALL"}
        onValueChange={handleClientChange}
      >
        <SelectTrigger className="sm:w-[200px]">
          <SelectValue placeholder="Todos os clientes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos os clientes</SelectItem>
          {clients.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Filtro de projeto aparece quando há cliente selecionado */}
      {(defaultClientId || projectOptions.length > 0) && (
        <Select
          defaultValue={defaultProjectId || "ALL"}
          onValueChange={(v) => push({ projectId: v })}
        >
          <SelectTrigger className="sm:w-[200px]">
            <SelectValue placeholder="Todos os projetos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os projetos</SelectItem>
            {projectOptions.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
