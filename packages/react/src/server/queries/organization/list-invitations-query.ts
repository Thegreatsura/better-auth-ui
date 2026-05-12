import { organizationQueryKeys } from "@better-auth-ui/core/plugins"
import {
  type DataTag,
  type QueryClient,
  queryOptions
} from "@tanstack/react-query"
import type { APIError } from "better-auth"

import type { OrganizationAuthServer } from "../../../lib/auth-server"

export type ListOrganizationInvitationsData<
  TAuth extends OrganizationAuthServer = OrganizationAuthServer
> = Awaited<ReturnType<TAuth["api"]["listInvitations"]>>

export type ListOrganizationInvitationsParams<
  TAuth extends OrganizationAuthServer = OrganizationAuthServer
> = Parameters<TAuth["api"]["listInvitations"]>[0]

/**
 * Query options factory for invitations of an organization.
 *
 * @param auth - The Better Auth server instance.
 * @param userId - The signed-in user's ID. Used for cache partitioning so
 *   the key matches the client-side `listOrganizationInvitationsOptions` for SSR hydration.
 * @param params - Parameters forwarded to `auth.api.listInvitations`.
 */
export function listOrganizationInvitationsOptions<
  TAuth extends OrganizationAuthServer
>(
  auth: TAuth,
  userId: string,
  params: ListOrganizationInvitationsParams<TAuth>
) {
  type TData = ListOrganizationInvitationsData<TAuth>
  const queryKey = organizationQueryKeys.invitations.list(userId, params?.query)

  const options = queryOptions<TData, APIError, TData, typeof queryKey>({
    queryKey,
    queryFn: () => auth.api.listInvitations(params) as Promise<TData>
  })

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, APIError>
  }
}

export const ensureListOrganizationInvitations = <
  TAuth extends OrganizationAuthServer
>(
  queryClient: QueryClient,
  auth: TAuth,
  userId: string,
  params: ListOrganizationInvitationsParams<TAuth>
) =>
  queryClient.ensureQueryData(
    listOrganizationInvitationsOptions(auth, userId, params)
  )

export const prefetchListOrganizationInvitations = <
  TAuth extends OrganizationAuthServer
>(
  queryClient: QueryClient,
  auth: TAuth,
  userId: string,
  params: ListOrganizationInvitationsParams<TAuth>
) =>
  queryClient.prefetchQuery(
    listOrganizationInvitationsOptions(auth, userId, params)
  )

export const fetchListOrganizationInvitations = <
  TAuth extends OrganizationAuthServer
>(
  queryClient: QueryClient,
  auth: TAuth,
  userId: string,
  params: ListOrganizationInvitationsParams<TAuth>
) =>
  queryClient.fetchQuery(
    listOrganizationInvitationsOptions(auth, userId, params)
  )
