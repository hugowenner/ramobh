import type { TemplateFieldType } from "../types";

export const FIELD_TYPE_LABELS: Record<TemplateFieldType, string> = {
  text: "Texto",
  textarea: "Área de texto",
  number: "Número",
  date: "Data",
  select: "Seleção",
  checkbox: "Checkbox",
};

export const FIELD_TYPES = [
  "text",
  "textarea",
  "number",
  "select",
  "checkbox",
  "date",
] as const satisfies readonly TemplateFieldType[];

export const DEFAULT_TEMPLATE_VERSION = "1";

export const PAGE_SIZE = 20;

export const TEMPLATE_SCHEMA_PLACEHOLDER = JSON.stringify(
  {
    version: DEFAULT_TEMPLATE_VERSION,
    sections: [
      {
        id: "general",
        title: "Informações Gerais",
        fields: [
          {
            id: "company_name",
            type: "text",
            label: "Empresa",
            required: true,
          },
          {
            id: "environment",
            type: "select",
            label: "Ambiente",
            required: true,
            options: ["Produção", "Homologação", "Desenvolvimento"],
          },
        ],
      },
    ],
  },
  null,
  2
);
