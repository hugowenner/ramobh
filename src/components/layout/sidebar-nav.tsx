"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-config";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-ramo-primary/10 text-ramo-primary"
                : "text-ramo-muted hover:bg-ramo-bg hover:text-ramo-text"
            )}
          >
            <item.icon
              className={cn(
                "h-4 w-4 shrink-0",
                isActive ? "text-ramo-primary" : "text-ramo-muted"
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
