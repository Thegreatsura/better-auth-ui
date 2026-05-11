import { OrganizationRowSkeleton } from "./organization-row-skeleton"

/**
 * Loading placeholder for {@link Organizations}: several {@link OrganizationRowSkeleton} rows.
 */
export function OrganizationsSkeleton() {
  return (
    <>
      {[0, 1].map((index) => (
        <div key={index}>
          {index > 0 && <div className="-mx-4 my-4 border-b border-dashed" />}
          <OrganizationRowSkeleton />
        </div>
      ))}
    </>
  )
}
