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
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
};

export function ClientSelect({
  clients,
  defaultValue,
  disabled = false,
  placeholder = "Selecione um cliente",
  required = false,
}: Props) {
  return (
    <Select
      name="clientId"
      defaultValue={defaultValue}
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
