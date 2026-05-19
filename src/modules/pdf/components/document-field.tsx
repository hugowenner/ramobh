import { View, Text } from "@react-pdf/renderer";
import { S } from "../constants";
import type { TemplateField } from "@/modules/templates/types";

// ── Value formatters ───────────────────────────────────────────

function formatDate(raw: unknown): string {
  if (!raw || typeof raw !== "string") return "—";
  try {
    const [year, month, day] = raw.split("-").map(Number);
    return new Intl.DateTimeFormat("pt-BR").format(
      new Date(year, month - 1, day)
    );
  } catch {
    return raw;
  }
}

function formatScalar(raw: unknown): string {
  if (raw === null || raw === undefined || raw === "") return "—";
  return String(raw);
}

// ── Sub-renderers ──────────────────────────────────────────────

function CheckboxRenderer({
  field,
  value,
}: {
  field: TemplateField;
  value: unknown;
}) {
  const checked = value === true;
  return (
    <View style={S.checkRow}>
      <View style={[S.checkBox, checked ? S.checkBoxFilled : {}]}>
        {checked && <Text style={S.checkMark}>✓</Text>}
      </View>
      <Text style={checked ? S.fieldValue : S.fieldEmpty}>
        {checked ? "Sim" : "Não preenchido"}
      </Text>
    </View>
  );
}

function TextareaRenderer({ value }: { value: unknown }) {
  const text = formatScalar(value);
  const isEmpty = text === "—";
  return (
    <Text style={isEmpty ? S.fieldEmpty : S.fieldValue}>{text}</Text>
  );
}

function ScalarRenderer({ value }: { value: unknown }) {
  const text = formatScalar(value);
  const isEmpty = text === "—";
  return (
    <Text style={isEmpty ? S.fieldEmpty : S.fieldValue}>{text}</Text>
  );
}

// ── Public component ───────────────────────────────────────────

type Props = {
  field: TemplateField;
  value: unknown;
};

/**
 * Renders a single template field as a labelled value in the PDF.
 * Wide (100%) for textarea, narrow (50%) for everything else.
 */
export function DocumentFieldPdf({ field, value }: Props) {
  const isWide = field.type === "textarea";
  const containerStyle = isWide ? S.fieldWide : S.fieldNarrow;

  return (
    <View style={containerStyle}>
      <Text style={S.fieldLabel}>{field.label}</Text>

      {field.type === "checkbox" && (
        <CheckboxRenderer field={field} value={value} />
      )}
      {field.type === "date" && (
        <ScalarRenderer value={formatDate(value)} />
      )}
      {field.type === "textarea" && (
        <TextareaRenderer value={value} />
      )}
      {(field.type === "text" ||
        field.type === "number" ||
        field.type === "select") && (
        <ScalarRenderer value={value} />
      )}
    </View>
  );
}
