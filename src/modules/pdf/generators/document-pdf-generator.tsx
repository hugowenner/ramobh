/**
 * server-only — this file must never be imported in client code.
 * @react-pdf/renderer uses Node.js APIs and a custom reconciler.
 */
import React from "react";
import { Document, Page, renderToBuffer } from "@react-pdf/renderer";
import { S } from "../constants";
import { DocumentHeader } from "../components/document-header";
import { DocumentMetadata } from "../components/document-metadata";
import { DocumentSection } from "../components/document-section";
import { DocumentFooter } from "../components/document-footer";
import type { DocumentPdfData } from "../types";

// ── Root PDF component ─────────────────────────────────────────

/**
 * Pure PDF document tree — no side effects, no DB calls.
 * Rendered deterministically from a DocumentPdfData snapshot.
 */
function DocumentPdf({ pdfData }: { pdfData: DocumentPdfData }) {
  return (
    <Document
      title={pdfData.title}
      author="Portal Técnico Ramo"
      subject={pdfData.template?.name ?? "Documento técnico"}
      creator="Ramo Portal"
      producer="@react-pdf/renderer"
      language="pt-BR"
    >
      <Page size="A4" style={S.page} wrap>
        <DocumentHeader pdfData={pdfData} />
        <DocumentMetadata pdfData={pdfData} />

        {pdfData.schemaSnapshot.sections.map((section) => (
          <DocumentSection
            key={section.id}
            section={section}
            data={pdfData.data}
          />
        ))}

        <DocumentFooter pdfData={pdfData} />
      </Page>
    </Document>
  );
}

// ── Generator function ─────────────────────────────────────────

/**
 * Renders the PDF document tree to a Node.js Buffer.
 * Must be called in a server context (Server Action or API route).
 */
export async function generateDocumentPdf(
  pdfData: DocumentPdfData
): Promise<Buffer> {
  const element = React.createElement(DocumentPdf, { pdfData });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return renderToBuffer(element as any);
}
