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
import { TemplateVersionBadge } from "@/modules/templates/components/template-version-badge";
import { DeleteTemplateButton } from "@/modules/templates/components/delete-template-button";
import type { TemplateListDTO } from "@/modules/templates/types";

type Props = {
  templates: TemplateListDTO[];
};

export function TemplateTable({ templates }: Props) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Versao</TableHead>
            <TableHead className="w-24 text-right">Secoes</TableHead>
            <TableHead className="w-24 text-right">Fields</TableHead>
            <TableHead className="w-32">Atualizado em</TableHead>
            <TableHead className="w-[140px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/templates/${template.id}`}
                  className="hover:underline"
                >
                  {template.name}
                </Link>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {template.category}
              </TableCell>
              <TableCell>
                <TemplateVersionBadge version={template.version} />
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {template.sectionCount}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {template.fieldCount}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateDisplay(template.updatedAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/templates/${template.id}`}>Ver</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/templates/${template.id}/edit`}>Editar</Link>
                  </Button>
                  <DeleteTemplateButton
                    id={template.id}
                    name={template.name}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function formatDateDisplay(date?: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}
