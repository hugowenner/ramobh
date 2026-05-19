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

  // undefined = "no filter active" — single canonical absence value
  const activeStatus: string | undefined = defaultStatus || undefined;
  const activeTemplateId: string | undefined = defaultTemplateId || undefined;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <Input
        placeholder="Buscar por título..."
        defaultValue={defaultSearch}
        onChange={(e) => handleSearch(e.target.value)}
        className="sm:max-w-xs"
      />

      <div className="flex items-center gap-1">
        <Select
          value={activeStatus}
          onValueChange={(v) => push({ status: v })}
        >
          <SelectTrigger className="sm:w-[180px]">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(DocumentStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {DOCUMENT_STATUS_LABELS[s]}
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
            onClick={() => push({ status: "" })}
            aria-label="Limpar filtro de status"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {templates.length > 0 && (
        <div className="flex items-center gap-1">
          <Select
            value={activeTemplateId}
            onValueChange={(v) => push({ templateId: v })}
          >
            <SelectTrigger className="sm:w-[220px]">
              <SelectValue placeholder="Todos os templates" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeTemplateId && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => push({ templateId: "" })}
              aria-label="Limpar filtro de template"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
