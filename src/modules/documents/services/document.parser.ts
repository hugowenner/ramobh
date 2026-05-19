import { documentContentSchema } from "../schemas";
import type { DocumentContent } from "../types";
import type { Document } from "@/generated/prisma";
import { ValidationError } from "@/core/errors";

/**
 * Converte Document.content (JsonValue) para DocumentContent tipado.
 * Lança ValidationError se o conteúdo estiver corrompido — nunca retorna unknown.
 */
export function parseDocumentContent(document: Document): DocumentContent {
  const parsed = documentContentSchema.safeParse(document.content);
  if (!parsed.success) {
    throw new ValidationError(
      `Conteúdo do documento "${document.id}" está corrompido`
    );
  }
  return parsed.data;
}

export type DocumentWithParsedContent = Omit<Document, "content"> & {
  content: DocumentContent;
};

export function withParsedContent(document: Document): DocumentWithParsedContent {
  return {
    ...document,
    content: parseDocumentContent(document),
  };
}
