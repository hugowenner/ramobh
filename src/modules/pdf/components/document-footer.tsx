import { View, Text } from "@react-pdf/renderer";
import { S } from "../constants";
import type { DocumentPdfData } from "../types";

type Props = { pdfData: DocumentPdfData };

/**
 * Fixed footer — rendered on every page.
 * Contains: origin label | document version | page counter.
 * Uses `render` prop for live page numbers.
 */
export function DocumentFooter({ pdfData }: Props) {
  return (
    <View style={S.footer} fixed>
      {/* Left: origin */}
      <Text style={S.footerText}>Portal Técnico Ramo</Text>

      {/* Center: document version stamp */}
      <Text style={S.footerText}>
        v. doc {pdfData.documentVersion.slice(0, 10)} · template v
        {pdfData.templateVersion}
      </Text>

      {/* Right: page counter */}
      <Text
        style={S.footerBold}
        render={({ pageNumber, totalPages }) =>
          `Pág. ${pageNumber} / ${totalPages}`
        }
      />
    </View>
  );
}
