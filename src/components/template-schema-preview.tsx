"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  TemplateField,
  TemplateFieldType,
  TemplateSchema,
} from "@/modules/templates/types";

const FIELD_LABELS: Record<TemplateFieldType, string> = {
  text: "Texto",
  textarea: "Area de texto",
  number: "Numero",
  select: "Selecao",
  checkbox: "Checkbox",
  date: "Data",
};

const FIELD_PREVIEW: Record<TemplateFieldType, string> = {
  text: "[Text Input]",
  textarea: "[Textarea]",
  number: "[Number Input]",
  select: "[Select]",
  checkbox: "[Checkbox]",
  date: "[Date Input]",
};

type Props = {
  schema: TemplateSchema;
  className?: string;
};

export function TemplateSchemaPreview({ schema, className }: Props) {
  return (
    <div className={cn("space-y-6", className)}>
      {schema.sections.map((section) => (
        <div key={section.id} className="rounded-md border p-4 space-y-3">
          <h4 className="font-medium text-sm">{section.title}</h4>
          <div className="space-y-2">
            {section.fields.map((field) => (
              <FieldPreviewItem key={field.id} field={field} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FieldPreviewItem({ field }: { field: TemplateField }) {
  return (
    <div className="rounded-md border bg-muted/40 p-3 space-y-2">
      <div className="text-xs text-muted-foreground">{FIELD_PREVIEW[field.type]}</div>
      <div className="text-sm font-medium">Label: {field.label}</div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="text-[10px]">
          {FIELD_LABELS[field.type]}
        </Badge>
        {field.required && (
          <Badge variant="destructive" className="text-[10px]">
            Required
          </Badge>
        )}
      </div>

      {field.placeholder && (
        <p className="text-xs text-muted-foreground">
          Placeholder: {field.placeholder}
        </p>
      )}

      {field.type === "select" && field.options?.length ? (
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Opcoes:</p>
          <div className="flex flex-wrap gap-1">
            {field.options.map((option) => (
              <Badge key={option} variant="secondary" className="text-xs">
                {option}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
