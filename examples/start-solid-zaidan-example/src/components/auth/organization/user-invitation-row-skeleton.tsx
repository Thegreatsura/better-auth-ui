import { Skeleton } from "@/components/ui/skeleton"

export function UserInvitationRowSkeleton() {
  return (
    <div class="flex items-center gap-3">
      <Skeleton class="size-10 shrink-0 rounded-md" />
      <div class="flex flex-col gap-1">
        <Skeleton class="h-4 w-40 rounded-md" />
        <Skeleton class="h-3 w-28 rounded-md" />
      </div>
    </div>
  )
}
