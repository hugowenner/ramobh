"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { FileDown, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateDocumentPdfAction } from "../actions/generate-document-pdf";

type Props = {
  documentId: string;
  /** If a PDF was already generated, show the download link immediately. */
  existingDownloadUrl?: string;
};

function fmtSize(kb: number): string {
  if (kb < 1000) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function GeneratePdfButton({ documentId, existingDownloadUrl }: Props) {
  const [isPending, startTransition] = useTransition();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(
    existingDownloadUrl ?? null
  );
  const [meta, setMeta] = useState<{ filename: string; sizeKb: number } | null>(
    null
  );

  function handleGenerate() {
    startTransition(async () => {
      const result = await generateDocumentPdfAction(documentId);
      if (result.success) {
        setDownloadUrl(result.data.downloadUrl);
        setMeta({ filename: result.data.filename, sizeKb: result.data.sizeKb });
        toast.success(
          `PDF gerado — ${result.data.filename} (${fmtSize(result.data.sizeKb)})`
        );
      } else {
        toast.error(result.error ?? "Erro ao gerar PDF");
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleGenerate}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileDown className="h-4 w-4" />
        )}
        {isPending ? "Gerando PDF..." : "Gerar PDF"}
      </Button>

      {downloadUrl && (
        <Button asChild size="sm">
          <a href={downloadUrl} download>
            <ExternalLink className="h-4 w-4" />
            Baixar PDF
            {meta && (
              <span className="ml-1 text-xs opacity-70">
                ({fmtSize(meta.sizeKb)})
              </span>
            )}
          </a>
        </Button>
      )}
    </div>
  );
}
