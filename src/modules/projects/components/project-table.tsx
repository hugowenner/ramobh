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
import { ProjectStatusBadge } from "./project-status-badge";
import { DeleteProjectButton } from "./delete-project-button";
import {
  PROJECT_TYPE_LABELS,
  formatDateDisplay,
} from "../utils/project";
import type { ProjectSummary } from "../types";

export function ProjectTable({ projects }: { projects: ProjectSummary[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Projeto</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Término</TableHead>
            <TableHead className="w-[100px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/projects/${project.id}`}
                  className="hover:underline"
                >
                  {project.name}
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={`/clients/${project.client.id}`}
                  className="text-muted-foreground hover:text-foreground hover:underline text-sm"
                >
                  {project.client.name}
                </Link>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {PROJECT_TYPE_LABELS[project.type]}
              </TableCell>
              <TableCell>
                <ProjectStatusBadge status={project.status} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateDisplay(project.startDate)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateDisplay(project.endDate)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/projects/${project.id}/edit`}>Editar</Link>
                  </Button>
                  <DeleteProjectButton
                    id={project.id}
                    name={project.name}
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
