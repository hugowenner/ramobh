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
import { EnvironmentTypeBadge } from "./environment-type-badge";
import { DeleteEnvironmentButton } from "./delete-environment-button";
import type { EnvironmentSummary } from "../types";

export function EnvironmentTable({
  environments,
}: {
  environments: EnvironmentSummary[];
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ambiente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Projeto</TableHead>
            <TableHead>Versão</TableHead>
            <TableHead className="w-[100px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {environments.map((env) => (
            <TableRow key={env.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/environments/${env.id}`}
                  className="hover:underline"
                >
                  {env.name}
                </Link>
              </TableCell>
              <TableCell>
                <EnvironmentTypeBadge type={env.type} />
              </TableCell>
              <TableCell>
                <Link
                  href={`/clients/${env.client.id}`}
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  {env.client.name}
                </Link>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {env.project ? (
                  <Link
                    href={`/projects/${env.project.id}`}
                    className="hover:text-foreground hover:underline"
                  >
                    {env.project.name}
                  </Link>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {env.version ?? "—"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/environments/${env.id}/edit`}>Editar</Link>
                  </Button>
                  <DeleteEnvironmentButton id={env.id} name={env.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
