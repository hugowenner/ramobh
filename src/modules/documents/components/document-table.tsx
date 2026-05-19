import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DocumentStatusBadge } from "./document-status-badge";
import { DeleteDocumentButton } from "./delete-document-button";
import type { DocumentListItem } from "../types";

type Props = {
  documents: DocumentListItem[];
};

function fmt(date?: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}

export function DocumentTable({ documents }: Props) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Projeto</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-32">Atualizado em</TableHead>
            <TableHead className="w-[140px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium max-w-[260px]">
                <Link
                  href={`/documents/${doc.id}`}
                  className="hover:underline line-clamp-2"
                >
                  {doc.title}
                </Link>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {doc.template ? (
                  <span title={doc.template.category}>{doc.template.name}</span>
                ) : (
                  <span className="italic">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {doc.client?.name ?? "—"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {doc.project?.name ?? "—"}
              </TableCell>
              <TableCell>
                <DocumentStatusBadge status={doc.status} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {fmt(doc.updatedAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/documents/${doc.id}`}>Ver</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/documents/${doc.id}/edit`}>Editar</Link>
                  </Button>
                  <DeleteDocumentButton id={doc.id} title={doc.title} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
