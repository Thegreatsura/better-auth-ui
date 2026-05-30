import { organizationQueryKeys } from "@better-auth-ui/core/plugins"
import { createQuery, type QueryClient } from "@tanstack/solid-query"
import type { OrganizationAuthClient } from "../../lib/auth-client"
import { useSession } from "../auth/session-query"
import { useActiveOrganization } from "./active-organization-query"
import {
  createOrganizationQueryOptions,
  ensureOrganizationQuery,
  fetchOrganizationQuery,
  prefetchOrganizationQuery,
  skipToken
} from "./utils"

export type ListOrganizationMembersData<
  TAuthClient extends OrganizationAuthClient = OrganizationAuthClient
> = Awaited<ReturnType<TAuthClient["organization"]["listMembers"]>>

export type ListOrganizationMembersParams<
  TAuthClient extends OrganizationAuthClient = OrganizationAuthClient
> = Parameters<TAuthClient["organization"]["listMembers"]>[0]

export type ListOrganizationMembersOptions<
  TAuthClient extends OrganizationAuthClient = OrganizationAuthClient
> = Omit<
  ReturnType<typeof listOrganizationMembersOptions<TAuthClient>>,
  "queryKey" | "queryFn"
>

export function listOrganizationMembersOptions<
  TAuthClient extends OrganizationAuthClient
>(
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ListOrganizationMembersParams<TAuthClient>
) {
  return createOrganizationQueryOptions(
    organizationQueryKeys.members.list(userId, params?.query),
    authClient.organization.listMembers,
    params
  )
}

export const ensureListOrganizationMembers = <
  TAuthClient extends OrganizationAuthClient
>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ListOrganizationMembersParams<TAuthClient>
) =>
  ensureOrganizationQuery(
    queryClient,
    organizationQueryKeys.members.list(userId, params?.query),
    authClient.organization.listMembers,
    params
  )

export const prefetchListOrganizationMembers = <
  TAuthClient extends OrganizationAuthClient
>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ListOrganizationMembersParams<TAuthClient>
) =>
  prefetchOrganizationQuery(
    queryClient,
    organizationQueryKeys.members.list(userId, params?.query),
    authClient.organization.listMembers,
    params
  )

export const fetchListOrganizationMembers = <
  TAuthClient extends OrganizationAuthClient
>(
  queryClient: QueryClient,
  authClient: TAuthClient,
  userId: string | undefined,
  params?: ListOrganizationMembersParams<TAuthClient>
) =>
  fetchOrganizationQuery(
    queryClient,
    organizationQueryKeys.members.list(userId, params?.query),
    authClient.organization.listMembers,
    params
  )

export type UseListOrganizationMembersOptions<
  TAuthClient extends OrganizationAuthClient = OrganizationAuthClient
> = ListOrganizationMembersOptions<TAuthClient> &
  ListOrganizationMembersParams<TAuthClient>

export function useListOrganizationMembers<
  TAuthClient extends OrganizationAuthClient
>(
  authClient: TAuthClient,
  options: UseListOrganizationMembersOptions<TAuthClient> = {}
) {
  const session = useSession(authClient)
  const { query, fetchOptions, ...queryOptionsRest } = options
  const activeOrganization = useActiveOrganization(authClient, {
    enabled: !query?.organizationId
  } as never)

  return createQuery(() => {
    const userId = session.data?.user.id
    const organizationId = query?.organizationId ?? activeOrganization.data?.id
    const params = {
      query: { ...query, organizationId },
      fetchOptions
    } as ListOrganizationMembersParams<TAuthClient>
    const baseOptions = listOrganizationMembersOptions(
      authClient,
      userId,
      params
    )

    return {
      ...queryOptionsRest,
      ...baseOptions,
      queryFn: userId && organizationId ? baseOptions.queryFn : skipToken
    }
  })
}
