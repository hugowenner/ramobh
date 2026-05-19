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
import { ClientStatus } from "@/generated/prisma";
import { useDebouncedCallback } from "use-debounce";

const STATUS_OPTIONS = [
  { value: ClientStatus.ACTIVE, label: "Ativo" },
  { value: ClientStatus.INACTIVE, label: "Inativo" },
  { value: ClientStatus.PROSPECT, label: "Prospecto" },
];

export function ClientFilters({
  defaultSearch = "",
  defaultStatus = "",
}: {
  defaultSearch?: string;
  defaultStatus?: string;
}) {
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

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        placeholder="Buscar por nome ou CNPJ..."
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
    </div>
  );
}
