"use client";

import { useCallback } from "react";
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
import { ProjectStatus } from "@/generated/prisma";
import { PROJECT_STATUS_LABELS } from "../utils/project";
import { useDebouncedCallback } from "use-debounce";
import type { ClientOption } from "@/modules/clients/components/client-select";

const STATUS_OPTIONS = Object.values(ProjectStatus).map((s) => ({
  value: s,
  label: PROJECT_STATUS_LABELS[s],
}));

type Props = {
  clients: ClientOption[];
  defaultSearch?: string;
  defaultStatus?: string;
  defaultClientId?: string;
};

export function ProjectFilters({
  clients,
  defaultSearch = "",
  defaultStatus = "",
  defaultClientId = "",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const push = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleSearch = useDebouncedCallback(
    (value: string) => push("search", value),
    400
  );

  const activeStatus: string | undefined = defaultStatus || undefined;
  const activeClientId: string | undefined = defaultClientId || undefined;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <Input
        placeholder="Buscar por projeto ou cliente..."
        defaultValue={defaultSearch}
        onChange={(e) => handleSearch(e.target.value)}
        className="sm:max-w-xs"
      />

      <div className="flex items-center gap-1">
        <Select
          value={activeStatus}
          onValueChange={(v) => push("status", v)}
        >
          <SelectTrigger className="sm:w-[180px]">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {activeStatus && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => push("status", "")}
            aria-label="Limpar filtro de status"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Select
          value={activeClientId}
          onValueChange={(v) => push("clientId", v)}
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
            onClick={() => push("clientId", "")}
            aria-label="Limpar filtro de cliente"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
