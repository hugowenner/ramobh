import { Skeleton } from "@/components/ui/skeleton";
import { TableRowSkeleton } from "@/components/shared/loading-skeleton";

export default function DocumentsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-9 w-52" />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <div className="flex items-center gap-4 border-b bg-muted/50 px-4 py-3">
          {["flex-[2]", "flex-[1.5]", "flex-1", "flex-1", "w-28", "w-32", "w-32"].map(
            (cls, i) => (
              <Skeleton key={i} className={`h-4 ${cls}`} />
            )
          )}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <TableRowSkeleton key={i} cols={7} />
        ))}
      </div>
    </div>
  );
}
