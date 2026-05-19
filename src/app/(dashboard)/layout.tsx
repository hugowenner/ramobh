import { redirect } from "next/navigation";
import { auth } from "@/core/auth/config";
import { AppSidebar } from "@/components/layout/app-sidebar";
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
      <div className="flex h-screen overflow-hidden bg-slate-50">
        {/* Sidebar fixa */}
        <AppSidebar />

        {/* Área de conteúdo */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar session={session} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
