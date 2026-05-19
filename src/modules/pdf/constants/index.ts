import { StyleSheet } from "@react-pdf/renderer";

// ── Brand tokens ───────────────────────────────────────────────

export const BRAND = {
  primary: "#1e293b",    // slate-800 — headings
  accent: "#2563eb",     // blue-600  — logo, dividers
  muted: "#64748b",      // slate-500 — labels
  mutedLight: "#94a3b8", // slate-400 — empty values
  border: "#e2e8f0",     // slate-200 — dividers
  background: "#f8fafc", // slate-50  — metadata bg
  white: "#ffffff",
  text: "#0f172a",       // slate-900 — body text
} as const;

export const FONT = {
  regular: "Helvetica",
  bold: "Helvetica-Bold",
  oblique: "Helvetica-Oblique",
} as const;

// ── Shared stylesheet ──────────────────────────────────────────

export const S = StyleSheet.create({
  // ── Page ──────────────────────────────────────────────────
  page: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: BRAND.text,
    backgroundColor: BRAND.white,
    paddingTop: 48,
    paddingBottom: 72, // footer clearance
    paddingHorizontal: 48,
    lineHeight: 1.5,
  },

  // ── Header ────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: BRAND.accent,
    borderBottomStyle: "solid",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
    minWidth: 110,
  },
  logo: {
    fontSize: 16,
    fontFamily: FONT.bold,
    color: BRAND.accent,
    letterSpacing: 2,
    marginBottom: 2,
  },
  logoSub: {
    fontSize: 7,
    color: BRAND.muted,
    letterSpacing: 1,
  },
  docTitle: {
    fontSize: 15,
    fontFamily: FONT.bold,
    color: BRAND.primary,
    marginBottom: 3,
  },
  docTemplate: {
    fontSize: 9,
    color: BRAND.muted,
  },
  genDate: {
    fontSize: 8,
    color: BRAND.muted,
    marginBottom: 2,
  },

  // ── Metadata block ─────────────────────────────────────────
  metaBlock: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: BRAND.background,
    borderWidth: 1,
    borderColor: BRAND.border,
    borderStyle: "solid",
    borderRadius: 3,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  metaItem: {
    width: "50%",
    marginBottom: 8,
    paddingRight: 8,
  },
  metaLabel: {
    fontSize: 7,
    fontFamily: FONT.bold,
    color: BRAND.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 10,
    color: BRAND.text,
  },
  metaEmpty: {
    fontSize: 10,
    color: BRAND.mutedLight,
    fontFamily: FONT.oblique,
  },

  // ── Section ────────────────────────────────────────────────
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: FONT.bold,
    color: BRAND.primary,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
    borderBottomStyle: "solid",
  },
  fieldsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  // ── Field ──────────────────────────────────────────────────
  fieldNarrow: {
    width: "50%",
    paddingRight: 12,
    marginBottom: 10,
  },
  fieldWide: {
    width: "100%",
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 7,
    fontFamily: FONT.bold,
    color: BRAND.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  fieldValue: {
    fontSize: 10,
    color: BRAND.text,
    lineHeight: 1.4,
  },
  fieldEmpty: {
    fontSize: 10,
    color: BRAND.mutedLight,
    fontFamily: FONT.oblique,
  },

  // ── Checkbox ───────────────────────────────────────────────
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkBox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: BRAND.primary,
    borderStyle: "solid",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  checkBoxFilled: {
    backgroundColor: BRAND.accent,
    borderColor: BRAND.accent,
  },
  checkMark: {
    fontSize: 7,
    fontFamily: FONT.bold,
    color: BRAND.white,
  },

  // ── Footer ─────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
    borderTopStyle: "solid",
  },
  footerText: {
    fontSize: 7,
    color: BRAND.muted,
  },
  footerBold: {
    fontSize: 7,
    fontFamily: FONT.bold,
    color: BRAND.muted,
  },
});
