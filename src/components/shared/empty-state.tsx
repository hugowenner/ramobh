import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Props = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-ramo-border bg-ramo-surface py-16 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ramo-primary/10">
          <Icon className="h-6 w-6 text-ramo-primary" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-ramo-text">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-ramo-muted">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
