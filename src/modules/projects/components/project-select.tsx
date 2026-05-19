"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ProjectOption = { id: string; name: string };

type Props = {
  projects: ProjectOption[];
  /** Uncontrolled initial value. "" | undefined = no project selected. */
  defaultValue?: string;
  /** Controlled value. Pass undefined for "nothing selected". */
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
};

/**
 * Optional project selector.
 *
 * State model:
 *   string   = a project is selected (its CUID)
 *   undefined = no project (optional field not filled)
 *
 * The component renders a <input type="hidden" name="projectId">
 * that always carries "" when undefined, so the server action's
 * optId("projectId") converts it to null correctly.
 */
export function ProjectSelect({
  projects,
  defaultValue,
  value: valueProp,
  onValueChange,
  disabled = false,
  placeholder = "Nenhum (opcional)",
}: Props) {
  const controlled = valueProp !== undefined || onValueChange !== undefined;

  // Internal state for uncontrolled mode.
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue || undefined
  );

  const activeValue: string | undefined = controlled ? valueProp : internalValue;

  function handleChange(v: string) {
    if (!controlled) setInternalValue(v);
    onValueChange?.(v);
  }

  function handleClear() {
    if (!controlled) setInternalValue(undefined);
    onValueChange?.(undefined);
  }

  return (
    <div className="flex items-center gap-1">
      {/* Carries normalised value to the form: "" when nothing selected */}
      <input type="hidden" name="projectId" value={activeValue ?? ""} />

      <Select
        value={activeValue}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {activeValue && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={handleClear}
          aria-label="Limpar projeto selecionado"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
