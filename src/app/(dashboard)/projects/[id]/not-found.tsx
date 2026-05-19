import Link from "next/link";
import { FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
        <FolderKanban className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold">Projeto não encontrado</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        O projeto que você está procurando não existe ou foi removido.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-4">
        <Link href="/projects">Ver todos os projetos</Link>
      </Button>
    </div>
  );
}
