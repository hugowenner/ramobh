"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateDocumentStatus } from "../actions";
import { DOCUMENT_STATUS_LABELS, DOCUMENT_STATUS_TRANSITIONS } from "../constants";
import type { DocumentStatus } from "@/generated/prisma";

type Props = {
  documentId: string;
  currentStatus: DocumentStatus;
};

export function DocumentStatusActions({ documentId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const allowed = DOCUMENT_STATUS_TRANSITIONS[currentStatus];

  if (allowed.length === 0) return null;

  function handleTransition(status: DocumentStatus) {
    startTransition(async () => {
      const result = await updateDocumentStatus(documentId, status);
      if (result.success) {
        toast.success(`Status alterado para "${DOCUMENT_STATUS_LABELS[status]}"`);
        router.refresh();
      } else {
        toast.error(result.error ?? "Erro ao alterar status");
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {allowed.map((status) => (
        <Button
          key={status}
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => handleTransition(status)}
        >
          {isPending ? "Aguarde..." : `→ ${DOCUMENT_STATUS_LABELS[status]}`}
        </Button>
      ))}
    </div>
  );
}
