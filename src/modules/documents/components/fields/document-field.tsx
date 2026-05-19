"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { TemplateField } from "@/modules/templates/types";
import type { FieldValue } from "../../types";

// ── Types ─────────────────────────────────────────────────────

type FieldProps = {
  field: TemplateField;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  readOnly?: boolean;
  error?: string;
};

// ── Individual renderers ──────────────────────────────────────

function TextField({ field, value, onChange, readOnly }: FieldProps) {
  if (readOnly) return <p className="text-sm py-1">{(value as string) || "—"}</p>;
  return (
    <Input
      id={`field-${field.id}`}
      type="text"
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      aria-required={field.required}
    />
  );
}

function TextareaField({ field, value, onChange, readOnly }: FieldProps) {
  if (readOnly) {
    return (
      <p className="text-sm py-1 whitespace-pre-wrap">
        {(value as string) || "—"}
      </p>
    );
  }
  return (
    <Textarea
      id={`field-${field.id}`}
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      rows={4}
      aria-required={field.required}
    />
  );
}

function NumberField({ field, value, onChange, readOnly }: FieldProps) {
  if (readOnly)
    return <p className="text-sm py-1">{value !== null && value !== undefined ? String(value) : "—"}</p>;
  return (
    <Input
      id={`field-${field.id}`}
      type="number"
      value={value !== null && value !== undefined ? String(value) : ""}
      onChange={(e) => {
        const n = e.target.value === "" ? null : Number(e.target.value);
        onChange(n);
      }}
      placeholder={field.placeholder}
      aria-required={field.required}
    />
  );
}

function DateField({ field, value, onChange, readOnly }: FieldProps) {
  if (readOnly) return <p className="text-sm py-1">{(value as string) || "—"}</p>;
  return (
    <Input
      id={`field-${field.id}`}
      type="date"
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
      aria-required={field.required}
    />
  );
}

function SelectField({ field, value, onChange, readOnly }: FieldProps) {
  const options = field.options ?? [];

  if (readOnly) return <p className="text-sm py-1">{(value as string) || "—"}</p>;

  return (
    <Select
      value={(value as string) ?? ""}
      onValueChange={(v) => onChange(v)}
    >
      <SelectTrigger id={`field-${field.id}`}>
        <SelectValue placeholder={field.placeholder ?? "Selecione..."} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function CheckboxField({ field, value, onChange, readOnly }: FieldProps) {
  const checked = value === true;

  if (readOnly) {
    return (
      <div className="flex items-center gap-2 py-1">
        <div
          className={cn(
            "h-4 w-4 rounded border flex-shrink-0",
            checked
              ? "bg-primary border-primary"
              : "border-border bg-background"
          )}
        />
        <span className="text-sm text-muted-foreground">
          {checked ? "Sim" : "Não"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 py-1">
      <input
        id={`field-${field.id}`}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
        aria-required={field.required}
      />
      <Label
        htmlFor={`field-${field.id}`}
        className="cursor-pointer font-normal text-sm"
      >
        {checked ? "Sim" : "Não"}
      </Label>
    </div>
  );
}

// ── Public component ──────────────────────────────────────────

/**
 * Renders a single template field as an interactive input or a read-only display.
 * Used inside DynamicDocumentForm (edit) and DynamicDocumentViewer (read-only).
 */
export function DocumentField({ field, value, onChange, readOnly = false, error }: FieldProps) {
  const labelId = `label-${field.id}`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={readOnly ? undefined : `field-${field.id}`} id={labelId}>
        {field.label}
        {field.required && !readOnly && (
          <span className="text-destructive ml-1">*</span>
        )}
      </Label>

      {field.type === "text" && (
        <TextField field={field} value={value} onChange={onChange} readOnly={readOnly} />
      )}
      {field.type === "textarea" && (
        <TextareaField field={field} value={value} onChange={onChange} readOnly={readOnly} />
      )}
      {field.type === "number" && (
        <NumberField field={field} value={value} onChange={onChange} readOnly={readOnly} />
      )}
      {field.type === "date" && (
        <DateField field={field} value={value} onChange={onChange} readOnly={readOnly} />
      )}
      {field.type === "select" && (
        <SelectField field={field} value={value} onChange={onChange} readOnly={readOnly} />
      )}
      {field.type === "checkbox" && (
        <CheckboxField field={field} value={value} onChange={onChange} readOnly={readOnly} />
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
