import { cn } from "@/lib/utils";
import type { TemplateField, TemplateSchema } from "@/modules/templates/types";
import type { DocumentData, FieldValue } from "../types";

// ── Value display ─────────────────────────────────────────────

function formatValue(field: TemplateField, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";

  switch (field.type) {
    case "checkbox":
      return value === true ? "✓ Sim" : "✗ Não";
    case "date": {
      const str = value as string;
      if (!str) return "—";
      try {
        // Convert YYYY-MM-DD to locale date
        const [year, month, day] = str.split("-").map(Number);
        return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
      } catch {
        return str;
      }
    }
    default:
      return String(value);
  }
}

function FieldValueDisplay({
  field,
  value,
}: {
  field: TemplateField;
  value: unknown;
}) {
  if (field.type === "checkbox") {
    const checked = value === true;
    return (
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "h-4 w-4 rounded border flex-shrink-0",
            checked ? "bg-primary border-primary" : "border-border"
          )}
        />
        <span className={cn("text-sm", !checked && "text-muted-foreground")}>
          {checked ? "Sim" : "Não"}
        </span>
      </div>
    );
  }

  const formatted = formatValue(field, value);
  const isEmpty = formatted === "—";

  return (
    <p
      className={cn(
        "text-sm",
        field.type === "textarea" && "whitespace-pre-wrap",
        isEmpty && "text-muted-foreground italic"
      )}
    >
      {formatted}
    </p>
  );
}

// ── Component ─────────────────────────────────────────────────

type Props = {
  schema: TemplateSchema;
  data: DocumentData;
  /** Extra wrapper class */
  className?: string;
};

/**
 * Read-only view of a filled document.
 * Renders each section with its fields and their stored values.
 * Used in document detail pages and PDF previews.
 * This is a Server Component — no interactivity needed.
 */
export function DynamicDocumentViewer({ schema, data, className }: Props) {
  return (
    <div className={cn("space-y-8", className)}>
      {schema.sections.map((section) => (
        <div key={section.id} className="space-y-4">
          <div className="border-b pb-1.5">
            <h3 className="text-sm font-semibold">{section.title}</h3>
          </div>

          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {section.fields.map((field) => {
              const isWide = field.type === "textarea";
              return (
                <div
                  key={field.id}
                  className={cn("space-y-1", isWide && "sm:col-span-2")}
                >
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {field.label}
                  </p>
                  <FieldValueDisplay
                    field={field}
                    value={data[field.id] as FieldValue}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
