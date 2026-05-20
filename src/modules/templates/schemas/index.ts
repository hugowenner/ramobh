import { z } from "zod";
import { PAGE_SIZE } from "../constants";

// ══════════════════════════════════════════════════════════════════════════════
// CAMADA 1 — CORE VALIDATOR
// ══════════════════════════════════════════════════════════════════════════════
//
// Valida APENAS o contrato mínimo estrutural:
//   meta.version + sections[].id + sections[].title + fields[].id/type/label
//
// Regra: backend valida estrutura, NÃO comportamento.
// Tudo fora do contrato mínimo passa sem validação (.passthrough()).
//
// ─ O QUE NÃO É VALIDADO AQUI (intencionalmente) ─────────────────────────────
//   ui.*          → responsabilidade do renderer
//   validation.*  → responsabilidade do renderer
//   business.*    → responsabilidade do engine de regras
//   integration.* → responsabilidade do conector SAP/externo
//   dependsOn.*   → responsabilidade do engine de dependências
//   custom.*      → livre, nunca validado
//   extensions.*  → livre, nunca validado
// ─────────────────────────────────────────────────────────────────────────────

const VALID_FIELD_TYPES = [
  "text",
  "textarea",
  "number",
  "select",
  "checkbox",
  "date",
] as const;

/**
 * Core field validator — contrato mínimo.
 * .passthrough() aceita qualquer chave extra sem erro.
 */
export const coreFieldSchema = z
  .object({
    id: z.string().min(1, "field.id obrigatório"),
    type: z.enum(VALID_FIELD_TYPES, {
      errorMap: () => ({
        message: `field.type deve ser um de: ${VALID_FIELD_TYPES.join(", ")}`,
      }),
    }),
    label: z.string().min(1, "field.label obrigatório"),
  })
  .passthrough(); // ui, validation, business, dependsOn, custom → aceitos

/**
 * Core section validator — contrato mínimo.
 * .passthrough() aceita description, order, collapsible, dependsOn, ui, etc.
 */
export const coreSectionSchema = z
  .object({
    id: z.string().min(1, "section.id obrigatório"),
    title: z.string().min(1, "section.title obrigatório"),
    fields: z.array(coreFieldSchema).min(1, "section deve ter pelo menos 1 field"),
  })
  .passthrough();

/**
 * Core schema validator — contrato mínimo canônico.
 *
 * Exige:
 *   meta.version  — localização canônica da versão
 *   sections      — array não-vazio de seções
 *
 * Aceita sem validar:
 *   layout, extensions, e qualquer outra chave de nível raiz
 *
 * IMPORTANTE: este validator espera o formato normalizado.
 * Passe o JSON por normalizeFormSchema() ANTES de usar este validator.
 */
export const templateSchemaDefinition = z
  .object({
    meta: z
      .object({
        version: z.string().min(1, "meta.version obrigatória"),
      })
      .passthrough(),
    sections: z.array(coreSectionSchema).min(1, "schema deve ter pelo menos 1 section"),
    layout: z.record(z.unknown()).optional(),
    extensions: z.record(z.unknown()).optional(),
    // version na raiz: aceito para backward compat, mas não exigido
    version: z.string().optional(),
  })
  .passthrough();

// ══════════════════════════════════════════════════════════════════════════════
// CAMADA 2 — RENDERER VALIDATOR
// ══════════════════════════════════════════════════════════════════════════════
//
// Usado APENAS pelo renderer de formulários (DynamicDocumentForm, etc.).
// Valida a estrutura exata que o renderer precisa para saber COMO renderizar.
// NÃO é usado para salvar templates no banco — apenas para renderização.
//
// Permanece strict() porque o renderer precisa saber exatamente o que tem.
// Um campo "select" sem "options" no renderer é um bug de renderização.
// ─────────────────────────────────────────────────────────────────────────────

const rendererFieldBase = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  required: z.boolean().optional().default(false),
  placeholder: z.string().optional(),
});

/**
 * Renderer field validator — discriminated union estrita para renderização.
 * Exportado como `fieldSchema` para compatibilidade com código existente.
 */
export const fieldSchema = z.discriminatedUnion("type", [
  rendererFieldBase.extend({ type: z.literal("text") }).passthrough(),
  rendererFieldBase.extend({ type: z.literal("textarea") }).passthrough(),
  rendererFieldBase.extend({ type: z.literal("number") }).passthrough(),
  rendererFieldBase.extend({ type: z.literal("date") }).passthrough(),
  rendererFieldBase.extend({ type: z.literal("checkbox") }).passthrough(),
  rendererFieldBase
    .extend({
      type: z.literal("select"),
      options: z.array(z.string().min(1)).min(1, "select exige options"),
    })
    .passthrough(),
]);

/**
 * Renderer section validator.
 * Exportado como `sectionSchema` para compatibilidade.
 */
export const sectionSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    fields: z.array(fieldSchema).min(1),
  })
  .passthrough();

// ══════════════════════════════════════════════════════════════════════════════
// SCHEMAS DE API (criação / atualização de Template via UI)
// ══════════════════════════════════════════════════════════════════════════════

export const createTemplateSchema = z.object({
  name: z.string().min(2, "mínimo 2 caracteres").max(200),
  description: z.string().min(1, "descricao obrigatoria").max(2000),
  category: z.string().min(1, "categoria obrigatória").max(100),
  schema: templateSchemaDefinition,
  isActive: z.boolean().default(true),
});

export const updateTemplateSchema = createTemplateSchema.partial();

export const listTemplatesSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(PAGE_SIZE),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type ListTemplatesInput = z.infer<typeof listTemplatesSchema>;
