import { Skeleton, Table } from "@heroui/react"

import { UserView } from "../user/user-view"

/**
 * Placeholder row matching {@link OrganizationMemberRow} while members load.
 */
export function OrganizationMemberRowSkeleton() {
  return (
    <Table.Row>
      <Table.Cell>
        <UserView isPending className="gap-3 py-0.5" size="md" />
      </Table.Cell>

      <Table.Cell>
        <Skeleton className="h-4 w-16 rounded-lg" />
      </Table.Cell>

      <Table.Cell className="text-end">
        <div className="ml-auto flex items-center justify-end gap-1">
          <Skeleton className="size-8 rounded-lg" />

          <Skeleton className="size-8 rounded-lg" />
        </div>
      </Table.Cell>
    </Table.Row>
  )
}
