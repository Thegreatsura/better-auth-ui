import { Skeleton, Table } from "@heroui/react"

/**
 * Placeholder row matching {@link OrganizationInvitationTableRow} while
 * invitations load.
 */
export function OrganizationInvitationRowSkeleton() {
  return (
    <Table.Row>
      <Table.Cell>
        <Skeleton className="h-4 w-48 rounded-lg" />
      </Table.Cell>

      <Table.Cell>
        <Skeleton className="h-4 w-36 rounded-lg" />
      </Table.Cell>

      <Table.Cell>
        <Skeleton className="h-4 w-16 rounded-lg" />
      </Table.Cell>

      <Table.Cell>
        <Skeleton className="h-4 w-14 rounded-full" />
      </Table.Cell>

      <Table.Cell />
    </Table.Row>
  )
}
