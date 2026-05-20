import { redirect } from "next/navigation";
import { auth } from "@/core/auth/config";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppFooter } from "@/components/layout/app-footer";
import { Topbar } from "@/components/layout/topbar";
import { SessionProvider } from "@/components/layout/session-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      {/*
       * App Shell — estrutura global de toda rota autenticada
       *
       * ┌────────────────────────────────────────┐
       * │ Topbar (h-14, largura total)           │
       * ├──────────────┬─────────────────────────┤
       * │ AppSidebar   │ <main> content           │
       * │ (w-64)       │ (scroll interno)         │
       * ├──────────────┴─────────────────────────┤
       * │ AppFooter (h-9, largura total)         │
       * └────────────────────────────────────────┘
       */}
      <div className="flex h-screen flex-col overflow-hidden">
        {/* Header global — cobre toda a largura */}
        <Topbar session={session} />

        {/* Corpo: sidebar + conteúdo */}
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />

          <main className="flex-1 overflow-y-auto app-bg">
            <div className="p-6 lg:p-8">{children}</div>
          </main>
        </div>

        {/* Footer global — cobre toda a largura */}
        <AppFooter />
      </div>
    </SessionProvider>
  );
}
