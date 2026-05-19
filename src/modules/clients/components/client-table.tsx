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
import { ClientStatusBadge } from "./client-status-badge";
import { DeleteClientButton } from "./delete-client-button";
import { formatCnpj } from "../utils/cnpj";
import type { ClientSummary } from "../types";

export function ClientTable({ clients }: { clients: ClientSummary[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Segmento</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/clients/${client.id}`}
                  className="hover:underline"
                >
                  {client.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {client.cnpj ? formatCnpj(client.cnpj) : "—"}
              </TableCell>
              <TableCell>{client.segment ?? "—"}</TableCell>
              <TableCell>
                {[client.city, client.state, client.country]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </TableCell>
              <TableCell>
                <ClientStatusBadge status={client.status} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/clients/${client.id}/edit`}>Editar</Link>
                  </Button>
                  <DeleteClientButton id={client.id} name={client.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
