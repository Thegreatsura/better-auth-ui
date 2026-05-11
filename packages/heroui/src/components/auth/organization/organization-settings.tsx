import {
  type OrganizationAuthClient,
  useActiveOrganization,
  useAuth,
  useAuthPlugin
} from "@better-auth-ui/react"
import { cn } from "@heroui/react"
import type { ComponentProps } from "react"

import { organizationPlugin } from "../../../lib/auth/organization-plugin"
import { OrganizationMembers } from "./organization-members"

export type OrganizationSettingsProps = {
  className?: string
}

/**
 * Renders the organization settings layout.
 *
 * Displays the active organization info and sections for managing members
 * and invitations.
 *
 * @param className - Optional additional CSS class names for the outer container.
 * @returns The organization settings container as a JSX element.
 */
export function OrganizationSettings({
  className,
  ...props
}: OrganizationSettingsProps & ComponentProps<"div">) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const { data: activeOrganization } = useActiveOrganization(
    authClient as OrganizationAuthClient
  )

  return (
    <div
      className={cn("flex w-full flex-col gap-4 md:gap-6", className)}
      {...props}
    >
      <h2 className="mb-3 font-semibold text-sm">
        {organizationLocalization.organizationSettings}
      </h2>

      {activeOrganization ? (
        <>
          <div className="mb-4 flex items-center gap-3">
            {activeOrganization.logo && (
              <img
                src={activeOrganization.logo}
                alt={activeOrganization.name}
                className="size-12 rounded-lg object-cover"
              />
            )}

            <div className="flex-1">
              <h3 className="font-semibold text-base">
                {activeOrganization.name}
              </h3>

              {activeOrganization.slug && (
                <p className="text-muted text-sm">{activeOrganization.slug}</p>
              )}
            </div>
          </div>

          <OrganizationMembers />
        </>
      ) : (
        <p className="text-muted text-sm">
          {organizationLocalization.noActiveOrganization}
        </p>
      )}
    </div>
  )
}
