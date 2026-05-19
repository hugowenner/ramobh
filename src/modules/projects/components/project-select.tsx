"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ProjectOption = { id: string; name: string };

// Radix Select does not allow SelectItem value="".
// We use "__none__" as a sentinel for "no project selected" and
// normalise it to "" before exposing it to the form / parent.
const NONE = "__none__";

type Props = {
  projects: ProjectOption[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

// "" = "no project" (optional field)
export function ProjectSelect({
  projects,
  defaultValue,
  value: valueProp,
  onValueChange,
  disabled = false,
  placeholder = "Nenhum (opcional)",
}: Props) {
  // Internal state normalises "" ↔ NONE so Radix never sees value="".
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue ?? ""
  );

  const controlled = valueProp !== undefined && onValueChange !== undefined;

  // The "effective" value shown in the Select (maps "" → NONE so Radix is happy)
  const radixValue = (controlled ? valueProp : internalValue) || NONE;

  function handleChange(v: string) {
    const normalised = v === NONE ? "" : v;
    if (!controlled) setInternalValue(normalised);
    onValueChange?.(normalised);
  }

  return (
    <>
      {/* Hidden input carries the normalised value ("" for none) to the form */}
      <input
        type="hidden"
        name="projectId"
        value={controlled ? (valueProp ?? "") : internalValue}
      />
      <Select
        value={radixValue}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE}>Nenhum (opcional)</SelectItem>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
