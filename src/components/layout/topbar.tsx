import { UserMenu } from "./user-menu";
import type { Session } from "next-auth";

type Props = {
  session: Session;
};

export function Topbar({ session }: Props) {
  const { user } = session;

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Slot para breadcrumb — preenchido futuramente */}
      <div />

      <UserMenu
        name={user.name}
        email={user.email}
        role={user.role}
      />
    </header>
  );
}
