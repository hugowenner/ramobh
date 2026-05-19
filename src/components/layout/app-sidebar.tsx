import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./sidebar-nav";

export function AppSidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
          <span className="text-sm font-bold">R</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 leading-none">
            Portal Técnico
          </p>
          <p className="mt-0.5 text-xs text-slate-500 leading-none">
            Ramo Consultoria
          </p>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav />
      </div>

      <Separator />

      {/* Footer */}
      <div className="px-6 py-4">
        <p className="text-xs text-slate-400">
          Portal Técnico v0.1
        </p>
      </div>
    </aside>
  );
}
