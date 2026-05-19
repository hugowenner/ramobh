"use client";

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
  value,
  onValueChange,
  disabled = false,
  placeholder = "Nenhum (opcional)",
}: Props) {
  const controlled = value !== undefined && onValueChange !== undefined;

  return (
    <Select
      name="projectId"
      {...(controlled
        ? { value, onValueChange }
        : { defaultValue: defaultValue ?? "" })}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Nenhum (opcional)</SelectItem>
        {projects.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
