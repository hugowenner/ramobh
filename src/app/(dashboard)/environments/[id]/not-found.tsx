import Link from "next/link";
import { Server } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EnvironmentNotFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
        <Server className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold">Ambiente não encontrado</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Este ambiente não existe ou foi removido.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-4">
        <Link href="/environments">Ver todos os ambientes</Link>
      </Button>
    </div>
  );
}
