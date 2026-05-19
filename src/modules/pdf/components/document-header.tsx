import { View, Text } from "@react-pdf/renderer";
import { S } from "../constants";
import type { DocumentPdfData } from "../types";

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

type Props = { pdfData: DocumentPdfData };

/**
 * Top-of-page header: Ramo branding (left) + document title and template (right-ish).
 * Separated by a blue bottom border for corporate look.
 */
export function DocumentHeader({ pdfData }: Props) {
  return (
    <View style={S.header}>
      {/* Left: branding */}
      <View style={S.headerLeft}>
        <Text style={S.logo}>RAMO</Text>
        <Text style={S.logoSub}>PORTAL TÉCNICO</Text>
      </View>

      {/* Center/Right: document identity */}
      <View style={{ flex: 3, paddingHorizontal: 16 }}>
        <Text style={S.docTitle}>{pdfData.title}</Text>
        {pdfData.template && (
          <Text style={S.docTemplate}>
            {pdfData.template.category} › {pdfData.template.name}
          </Text>
        )}
      </View>

      {/* Right: dates */}
      <View style={S.headerRight}>
        <Text style={S.genDate}>Gerado em</Text>
        <Text style={{ ...S.genDate, color: "#1e293b" }}>
          {fmtDate(pdfData.generatedAt)}
        </Text>
      </View>
    </View>
  );
}
