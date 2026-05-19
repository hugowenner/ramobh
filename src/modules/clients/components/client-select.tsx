"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ClientOption = { id: string; name: string };

type Props = {
  clients: ClientOption[];
  // uncontrolled (default) — use in ProjectForm
  defaultValue?: string;
  // controlled — use in EnvironmentForm for dynamic ProjectSelect
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
};

export function ClientSelect({
  clients,
  defaultValue,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Selecione um cliente",
  required = false,
}: Props) {
  // Display mode: controlled when value prop is provided, uncontrolled otherwise.
  // IMPORTANT: onValueChange is ALWAYS propagated regardless of mode — otherwise
  // cascade handlers (e.g. load projects on client change) never fire when the
  // parent initialises with value=undefined and then the user makes a selection.
  const controlled = value !== undefined;

  return (
    <Select
      name="clientId"
      {...(controlled ? { value } : { defaultValue })}
      onValueChange={onValueChange}
      disabled={disabled}
      required={required}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {clients.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
