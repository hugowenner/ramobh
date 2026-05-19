import { Skeleton } from "@/components/ui/skeleton";
import { TableRowSkeleton } from "@/components/shared/loading-skeleton";

export default function ClientsLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-44" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        <div className="flex items-center gap-4 border-b bg-muted/50 px-4 py-3">
          {["flex-[2]", "flex-1", "flex-1", "flex-1", "w-20", "w-24"].map(
            (cls, i) => (
              <Skeleton key={i} className={`h-4 ${cls}`} />
            )
          )}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <TableRowSkeleton key={i} cols={6} />
        ))}
      </div>
    </div>
  );
}
