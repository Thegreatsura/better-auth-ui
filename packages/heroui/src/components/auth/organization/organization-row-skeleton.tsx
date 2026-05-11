import { Skeleton } from "@heroui/react"

/**
 * Placeholder row matching {@link OrganizationRow} while organization list data loads.
 */
export function OrganizationRowSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Skeleton className="size-8 shrink-0 rounded-full" />

        <div className="flex min-w-0 flex-col gap-1">
          <Skeleton className="h-3.5 w-28 rounded-lg" />

          <Skeleton className="h-3 w-36 rounded-lg" />
        </div>
      </div>

      <Skeleton className="h-8 w-24 shrink-0 rounded-lg" />
    </div>
  )
}
