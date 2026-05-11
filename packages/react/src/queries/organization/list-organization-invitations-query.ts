import { organizationQueryKeys } from "@better-auth-ui/core/plugins"
import {
  type DataTag,
  type QueryClient,
  queryOptions,
  useQuery
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"

import type { InferData, OrganizationAuthClient } from "../../lib/auth-client"
import { useSession } from "../auth/session-query"

export type ListOrganizationInvitationsData<
  TAuthClient extends OrganizationAuthClient
> = InferData<TAuthClient["organization"]["listInvitations"]>

export type ListOrganizationInvitationsParams<
  TAuthClient extends OrganizationAuthClient
> = Parameters<TAuthClient["organization"]["listInvitations"]>[0]

export type ListOrganizationInvitationsOptions<
  TAuthClient extends OrganizationAuthClient
> = Omit<
  ReturnType<typeof listOrganizationInvitationsOptions<TAuthClient>>,
  "queryKey" | "queryFn"
>

export function listOrganizationInvitationsOptions<
  TAuthClient extends OrganizationAuthClient
>(
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ListOrganizationInvitationsParams<TAuthClient>
) {
  type TData = ListOrganizationInvitationsData<TAuthClient>
  const queryKey = organizationQueryKeys.invitations(userId, params?.query)

  const options = queryOptions<TData, BetterFetchError, TData, typeof queryKey>(
    {
      queryKey,
      queryFn: ({ signal }) =>
        authClient.organization.listInvitations({
          ...params,
          fetchOptions: { ...params?.fetchOptions, signal, throw: true }
        }) as Promise<TData>
    }
  )

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, BetterFetchError>
  }
}

export const ensureListOrganizationInvitations = <
  TAuthClient extends OrganizationAuthClient
>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ListOrganizationInvitationsParams<TAuthClient>
) =>
  queryClient.ensureQueryData(
    listOrganizationInvitationsOptions(authClient, userId, params)
  )

export const prefetchListOrganizationInvitations = <
  TAuthClient extends OrganizationAuthClient
>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ListOrganizationInvitationsParams<TAuthClient>
) =>
  queryClient.prefetchQuery(
    listOrganizationInvitationsOptions(authClient, userId, params)
  )

export const fetchListOrganizationInvitations = <
  TAuthClient extends OrganizationAuthClient
>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ListOrganizationInvitationsParams<TAuthClient>
) =>
  queryClient.fetchQuery(
    listOrganizationInvitationsOptions(authClient, userId, params)
  )

export type UseListOrganizationInvitationsOptions<
  TAuthClient extends OrganizationAuthClient
> = ListOrganizationInvitationsOptions<TAuthClient> &
  ListOrganizationInvitationsParams<TAuthClient>

export function useListOrganizationInvitations<
  TAuthClient extends OrganizationAuthClient
>(
  authClient: TAuthClient,
  options: UseListOrganizationInvitationsOptions<TAuthClient> = {} as UseListOrganizationInvitationsOptions<TAuthClient>,
  queryClient?: QueryClient
) {
  const { data: session } = useSession(authClient, undefined, queryClient)
  const userId = session?.user.id

  const { query, fetchOptions, ...queryOptionsRest } = options

  const baseOptions = listOrganizationInvitationsOptions(authClient, userId, {
    query,
    fetchOptions
  } as ListOrganizationInvitationsParams<TAuthClient>)

  return useQuery(
    {
      ...queryOptionsRest,
      ...baseOptions,
      queryFn: userId ? baseOptions.queryFn : undefined
    },
    queryClient
  )
}
