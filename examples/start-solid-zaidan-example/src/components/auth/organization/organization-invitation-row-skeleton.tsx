import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

export function OrganizationInvitationRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton class="h-4 w-40 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton class="h-4 w-28 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton class="h-6 w-16 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton class="h-6 w-20 rounded-md" />
      </TableCell>
      <TableCell class="text-right">
        <Skeleton class="ml-auto size-8 rounded-md" />
      </TableCell>
    </TableRow>
  )
}
