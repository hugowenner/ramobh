import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Server,
  FileText,
  FileStack,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/generated/prisma";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  roles?: UserRole[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/clients",
    label: "Clientes",
    icon: Building2,
  },
  {
    href: "/projects",
    label: "Projetos",
    icon: FolderKanban,
  },
  {
    href: "/environments",
    label: "Ambientes",
    icon: Server,
  },
  {
    href: "/templates",
    label: "Templates",
    icon: FileText,
  },
  {
    href: "/documents",
    label: "Documentos",
    icon: FileStack,
  },
];
