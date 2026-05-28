import { organizationQueryKeys } from "@better-auth-ui/core/plugins"
import {
  type DataTag,
  type QueryClient,
  queryOptions
} from "@tanstack/react-query"
import type { APIError } from "better-auth"

import type { OrganizationAuthServer } from "../../../lib/auth-server"

export type ListUserInvitationsData<
  TAuth extends OrganizationAuthServer = OrganizationAuthServer
> = Awaited<ReturnType<TAuth["api"]["listUserInvitations"]>>

export type ListUserInvitationsParams<
  TAuth extends OrganizationAuthServer = OrganizationAuthServer
> = Parameters<TAuth["api"]["listUserInvitations"]>[0]

/**
 * Query options factory for invitations addressed to the current user.
 *
 * @param auth - The Better Auth server instance.
 * @param userId - The signed-in user's ID. Used for cache partitioning so
 *   the key matches the client-side `listUserInvitationsOptions` for SSR hydration.
 * @param params - Parameters forwarded to `auth.api.listUserInvitations`.
 */
export function listUserInvitationsOptions<
  TAuth extends OrganizationAuthServer
>(auth: TAuth, userId: string, params: ListUserInvitationsParams<TAuth>) {
  type TData = ListUserInvitationsData<TAuth>
  const queryKey = organizationQueryKeys.userInvitations.list(
    userId,
    params?.query
  )

  const options = queryOptions<TData, APIError, TData, typeof queryKey>({
    queryKey,
    queryFn: () => auth.api.listUserInvitations(params) as Promise<TData>
  })

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, APIError>
  }
}

export const ensureListUserInvitations = <TAuth extends OrganizationAuthServer>(
  queryClient: QueryClient,
  auth: TAuth,
  userId: string,
  params: ListUserInvitationsParams<TAuth>
) =>
  queryClient.ensureQueryData(listUserInvitationsOptions(auth, userId, params))

export const prefetchListUserInvitations = <
  TAuth extends OrganizationAuthServer
>(
  queryClient: QueryClient,
  auth: TAuth,
  userId: string,
  params: ListUserInvitationsParams<TAuth>
) => queryClient.prefetchQuery(listUserInvitationsOptions(auth, userId, params))

export const fetchListUserInvitations = <TAuth extends OrganizationAuthServer>(
  queryClient: QueryClient,
  auth: TAuth,
  userId: string,
  params: ListUserInvitationsParams<TAuth>
) => queryClient.fetchQuery(listUserInvitationsOptions(auth, userId, params))
