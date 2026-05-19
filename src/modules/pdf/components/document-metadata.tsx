import { View, Text } from "@react-pdf/renderer";
import { S } from "../constants";
import type { DocumentPdfData } from "../types";

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("pt-BR").format(d);
}

function MetaItem({ label, value }: { label: string; value: string | null | undefined }) {
  const isEmpty = !value;
  return (
    <View style={S.metaItem}>
      <Text style={S.metaLabel}>{label}</Text>
      <Text style={isEmpty ? S.metaEmpty : S.metaValue}>
        {isEmpty ? "Não informado" : value}
      </Text>
    </View>
  );
}

type Props = { pdfData: DocumentPdfData };

/**
 * Compact metadata grid showing the document context:
 * template, client, project, environment, status, author, dates.
 */
export function DocumentMetadata({ pdfData }: Props) {
  return (
    <View style={S.metaBlock}>
      <View style={S.metaRow}>
        <MetaItem label="Template" value={pdfData.template?.name} />
        <MetaItem label="Versão do template" value={`v${pdfData.templateVersion}`} />
        <MetaItem label="Cliente" value={pdfData.client?.name} />
        <MetaItem label="Projeto" value={pdfData.project?.name} />
        <MetaItem label="Ambiente" value={pdfData.environment?.name} />
        <MetaItem label="Status" value={pdfData.status} />
        <MetaItem label="Criado por" value={pdfData.createdBy?.name} />
        <MetaItem label="Data de criação" value={fmtDate(pdfData.createdAt)} />
      </View>
    </View>
  );
}
