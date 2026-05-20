/**
 * Ramo Design System — TypeScript color tokens
 *
 * Use estes valores em contextos JS: gráficos, canvas, estilos dinâmicos.
 * Para classes Tailwind use as utilities geradas (bg-ramo-*, text-ramo-*, etc.).
 * As variáveis CSS (--ramo-*) em globals.css são a fonte de verdade em runtime.
 *
 * @example — gráfico com Recharts/Chart.js
 *   fill={ramoColors.primary}
 *
 * @example — inline style
 *   style={{ borderColor: ramoCssVars.border }}
 */

// ── Valores hexadecimais ──────────────────────────────────────────────────────

export const ramoColors = {
  // Primária — azul corporativo
  primary:          "#1F4B99",
  primaryDark:      "#16386F",
  primaryLight:     "#2F6FE0",

  // Secundária — verde operacional
  secondary:        "#18A999",
  secondaryDark:    "#0F7C72",
  secondaryLight:   "#3BD3C6",

  // Neutros
  bg:               "#F6F8FC",
  surface:          "#FFFFFF",
  border:           "#E5EAF2",
  text:             "#1C2430",
  muted:            "#6B7280",

  // Estados
  success:          "#22C55E",
  warning:          "#F59E0B",
  error:            "#EF4444",
} as const;

export type RamoColorKey = keyof typeof ramoColors;

// ── Referências CSS para inline styles ───────────────────────────────────────
// Estas resolvem via :root → hex em runtime, respeitando futuras mudanças de tema.

export const ramoCssVars = {
  primary:          "var(--ramo-primary)",
  primaryDark:      "var(--ramo-primary-dark)",
  primaryLight:     "var(--ramo-primary-light)",
  secondary:        "var(--ramo-secondary)",
  secondaryDark:    "var(--ramo-secondary-dark)",
  secondaryLight:   "var(--ramo-secondary-light)",
  bg:               "var(--ramo-bg)",
  surface:          "var(--ramo-surface)",
  border:           "var(--ramo-border)",
  text:             "var(--ramo-text)",
  muted:            "var(--ramo-muted)",
  success:          "var(--ramo-success)",
  warning:          "var(--ramo-warning)",
  error:            "var(--ramo-error)",
} as const satisfies Record<RamoColorKey, string>;
