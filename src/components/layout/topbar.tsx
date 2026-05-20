import { UserMenu } from "./user-menu";
import type { Session } from "next-auth";

type Props = {
  session: Session;
};

export function Topbar({ session }: Props) {
  const { user } = session;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-ramo-border bg-ramo-surface px-6 z-10">
      {/* ── Esquerda: identidade + slot de breadcrumb ─────── */}
      <div className="flex items-center gap-3">
        {/* Logo compacto */}
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-ramo-primary text-white">
          <span className="text-xs font-bold select-none">R</span>
        </div>

        <span className="text-sm font-semibold text-ramo-text leading-none">
          Portal Técnico
        </span>

        {/* Divisor */}
        <span className="text-ramo-border text-lg leading-none select-none">·</span>

        {/* Slot para breadcrumb dinâmico — preenchido futuramente por Server Component */}
        <span className="text-sm text-ramo-muted leading-none">
          Ramo Consultoria SAP
        </span>
      </div>

      {/* ── Direita: ações globais ────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Slot futuro: search global */}
        {/* Slot futuro: notificações */}
        <UserMenu
          name={user.name}
          email={user.email}
          role={user.role}
        />
      </div>
    </header>
  );
}
