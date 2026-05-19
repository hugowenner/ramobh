import { View, Text } from "@react-pdf/renderer";
import { S } from "../constants";
import { DocumentFieldPdf } from "./document-field";
import type { TemplateSection } from "@/modules/templates/types";
import type { DocumentData } from "@/modules/documents/types";

type Props = {
  section: TemplateSection;
  data: DocumentData;
};

/**
 * Renders one template section: a bold title followed by a 2-column field grid.
 * Textarea fields span the full width automatically.
 */
export function DocumentSection({ section, data }: Props) {
  if (section.fields.length === 0) return null;

  return (
    <View style={S.section} wrap>
      <Text style={S.sectionTitle}>{section.title}</Text>
      <View style={S.fieldsRow}>
        {section.fields.map((field) => (
          <DocumentFieldPdf
            key={field.id}
            field={field}
            value={data[field.id]}
          />
        ))}
      </View>
    </View>
  );
}
