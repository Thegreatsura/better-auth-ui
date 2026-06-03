import { organizationLocalization } from "@better-auth-ui/core/plugins"
import type { OrganizationAuthClient } from "@better-auth-ui/solid"
import { useAuth, useListUserInvitations } from "@better-auth-ui/solid"
import { For, Show } from "solid-js"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { UserInvitationRow } from "./user-invitation-row"
import { UserInvitationRowSkeleton } from "./user-invitation-row-skeleton"
import { UserInvitationsEmpty } from "./user-invitations-empty"

export type UserInvitationsProps = {
  class?: string
}

type UserInvitation = {
  createdAt?: Date | string | null
  id: string
  organizationName?: string | null
  role?: string | null
}

export function UserInvitations(props: UserInvitationsProps) {
  const auth = useAuth()
  const invitations = useListUserInvitations(
    auth.authClient as OrganizationAuthClient
  )
  const invitationRows = () => (invitations.data ?? []) as UserInvitation[]

  return (
    <div class={cn("flex flex-col gap-3", props.class)}>
      <h2 class="truncate font-semibold text-sm">
        {organizationLocalization.invitations}
      </h2>
      <Card class="p-0">
        <CardContent class="p-0">
          <Show
            when={!invitations.isPending}
            fallback={
              <div class="p-4">
                <UserInvitationRowSkeleton />
              </div>
            }
          >
            <Show
              when={invitationRows().length > 0}
              fallback={<UserInvitationsEmpty />}
            >
              <div class="divide-y">
                <For each={invitationRows()}>
                  {(invitation) => (
                    <div class="p-4">
                      <UserInvitationRow invitation={invitation} />
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </Show>
        </CardContent>
      </Card>
    </div>
  )
}
