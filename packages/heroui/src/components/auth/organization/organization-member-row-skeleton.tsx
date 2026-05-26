import { Skeleton, Table } from "@heroui/react"

import { UserView } from "../user/user-view"

/**
 * Placeholder row matching {@link OrganizationMemberRow} while members load.
 */
export function OrganizationMemberRowSkeleton() {
  return (
    <Table.Row>
      <Table.Cell>
        <UserView isPending />
      </Table.Cell>

      <Table.Cell>
        <Skeleton className="h-4 w-18 rounded-lg" />
      </Table.Cell>

      <Table.Cell className="flex justify-end">
        <Skeleton className="size-8 rounded-full" />
      </Table.Cell>
    </Table.Row>
  )
}
