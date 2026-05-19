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
import { useDebouncedCallback } from "use-debounce";
import { DOCUMENT_STATUS_LABELS } from "../constants";
import { DocumentStatus } from "@/generated/prisma";

type TemplateOption = { id: string; name: string };

type Props = {
  templates: TemplateOption[];
  defaultSearch?: string;
  defaultStatus?: string;
  defaultTemplateId?: string;
};

export function DocumentFilters({
  templates,
  defaultSearch = "",
  defaultStatus = "",
  defaultTemplateId = "",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <Input
        placeholder="Buscar por título..."
        defaultValue={defaultSearch}
        onChange={(e) => handleSearch(e.target.value)}
        className="sm:max-w-xs"
      />

      <Select
        defaultValue={defaultStatus || ""}
        onValueChange={(v) => push({ status: v === "ALL" ? "" : v })}
      >
        <SelectTrigger className="sm:w-[180px]">
          <SelectValue placeholder="Todos os status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos os status</SelectItem>
          {Object.values(DocumentStatus).map((s) => (
            <SelectItem key={s} value={s}>
              {DOCUMENT_STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {templates.length > 0 && (
        <Select
          defaultValue={defaultTemplateId || ""}
          onValueChange={(v) => push({ templateId: v === "ALL" ? "" : v })}
        >
          <SelectTrigger className="sm:w-[220px]">
            <SelectValue placeholder="Todos os templates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os templates</SelectItem>
            {templates.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
