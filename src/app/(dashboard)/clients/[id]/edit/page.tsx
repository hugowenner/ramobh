import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { ClientForm } from "@/modules/clients/components/client-form";
import { updateClientAction } from "@/modules/clients/actions";
import { clientService } from "@/modules/clients/services/client.service";
import { NotFoundError } from "@/core/errors";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const client = await clientService.getById(id);
    return { title: `Editar — ${client.name}` };
  } catch {
    return { title: "Cliente não encontrado" };
  }
}

export default async function EditClientPage({ params }: { params: Params }) {
  const { id } = await params;

  let client;
  try {
    client = await clientService.getById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const boundAction = updateClientAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/clients/${id}`}>
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Editar — ${client.name}`}
        description="Atualize os dados do cliente"
      />

      <ClientForm
        action={boundAction}
        defaultValues={client}
        submitLabel="Salvar Alterações"
        redirectTo={`/clients/${id}`}
      />
    </div>
  );
}
