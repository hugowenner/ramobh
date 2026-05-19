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

type Props = {
  categories: string[];
  defaultSearch?: string;
  defaultCategory?: string;
};

export function TemplateFilters({
  categories,
  defaultSearch = "",
  defaultCategory = "",
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

  // undefined = "no filter active" — the single canonical absence value
  const activeCategory: string | undefined = defaultCategory || undefined;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <Input
        placeholder="Buscar por nome ou descrição..."
        defaultValue={defaultSearch}
        onChange={(e) => handleSearch(e.target.value)}
        className="sm:max-w-xs"
      />

      {categories.length > 0 && (
        <div className="flex items-center gap-1">
          <Select
            value={activeCategory}
            onValueChange={(v) => push({ category: v })}
          >
            <SelectTrigger className="sm:w-[200px]">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeCategory && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => push({ category: "" })}
              aria-label="Limpar filtro de categoria"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
