"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { DocumentField } from "./fields/document-field";
import type { TemplateField, TemplateSchema } from "@/modules/templates/types";
import type { DocumentData, FieldValue } from "../types";

// ── Types ─────────────────────────────────────────────────────

type Props = {
  schema: TemplateSchema;
  /** Pre-populated values for edit mode */
  defaultData?: DocumentData;
  /** Field-level error messages keyed by fieldId */
  fieldErrors?: Record<string, string>;
};

// ── Helpers ───────────────────────────────────────────────────

/** Returns the initial value for a field from defaultData, or a sensible empty default. */
function initialValue(field: TemplateField, defaultData: DocumentData): FieldValue {
  const stored = defaultData[field.id];
  if (stored !== undefined) return stored as FieldValue;
  if (field.type === "checkbox") return false;
  return null;
}

/** Wide fields (textarea) span both columns; narrow fields take one. */
function isWideField(field: TemplateField): boolean {
  return field.type === "textarea";
}

// ── Component ─────────────────────────────────────────────────

/**
 * Client component that manages the live state of all template fields.
 * Serializes the full data map into a hidden `<input name="data">` so the
 * parent Server Action receives it as a JSON string.
 *
 * Usage: place inside a `<form>` — the hidden input joins the FormData.
 */
export function DynamicDocumentForm({
  schema,
  defaultData = {},
  fieldErrors,
}: Props) {
  // Initialize state from all fields across all sections
  const [data, setData] = useState<DocumentData>(() => {
    const initial: DocumentData = {};
    for (const section of schema.sections) {
      for (const field of section.fields) {
        initial[field.id] = initialValue(field, defaultData);
      }
    }
    return initial;
  });

  function handleChange(fieldId: string, value: FieldValue) {
    setData((prev) => ({ ...prev, [fieldId]: value }));
  }

  return (
    <div className="space-y-6">
      {/* Serialized data map — picked up by the Server Action */}
      <input type="hidden" name="data" value={JSON.stringify(data)} />

      {schema.sections.map((section) => (
        <div key={section.id} className="space-y-4">
          <div className="border-b pb-1.5">
            <h3 className="text-sm font-semibold">{section.title}</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {section.fields.map((field) => (
              <div
                key={field.id}
                className={cn(isWideField(field) && "sm:col-span-2")}
              >
                <DocumentField
                  field={field}
                  value={data[field.id] as FieldValue}
                  onChange={(v) => handleChange(field.id, v)}
                  error={fieldErrors?.[field.id]}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
