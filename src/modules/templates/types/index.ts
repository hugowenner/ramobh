import type { Template } from "@/generated/prisma";

export type TemplateFieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "checkbox"
  | "date";

export interface TemplateField {
  id: string;
  type: TemplateFieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface TemplateSection {
  id: string;
  title: string;
  fields: TemplateField[];
}

export interface TemplateSchema {
  version: string;
  sections: TemplateSection[];
}

export type TemplateListDTO = Pick<Template, "id" | "name" | "category" | "updatedAt"> & {
  version: string;
  sectionCount: number;
  fieldCount: number;
};

export type TemplateDetailDTO = Pick<
  Template,
  "id" | "name" | "description" | "category" | "isActive" | "createdAt" | "updatedAt"
> & {
  schema: TemplateSchema;
};

export type TemplateEditDTO = Pick<
  Template,
  "id" | "name" | "description" | "category" | "isActive"
> & {
  schema: TemplateSchema;
};

export type TemplateFilters = {
  search?: string;
  category?: string;
  isActive?: boolean;
};
