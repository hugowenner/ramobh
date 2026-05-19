import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TemplateNotFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
        <FileText className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold">Template nao encontrado</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        O template que voce esta procurando nao existe ou foi removido.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-4">
        <Link href="/templates">Ver todos os templates</Link>
      </Button>
    </div>
  );
}
