"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
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

const STATUS_OPTIONS = [
  { value: "ALL", label: "Todos os status" },
  ...Object.values(ProjectStatus).map((s) => ({
    value: s,
    label: PROJECT_STATUS_LABELS[s],
  })),
];

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
      if (value && value !== "ALL") {
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

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <Input
        placeholder="Buscar por projeto ou cliente..."
        defaultValue={defaultSearch}
        onChange={(e) => handleSearch(e.target.value)}
        className="sm:max-w-xs"
      />
      <Select
        defaultValue={defaultStatus || "ALL"}
        onValueChange={(v) => push("status", v)}
      >
        <SelectTrigger className="sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={defaultClientId || "ALL"}
        onValueChange={(v) => push("clientId", v)}
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
    </div>
  );
}
