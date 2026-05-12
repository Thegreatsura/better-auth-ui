import { organizationQueryKeys } from "@better-auth-ui/core/plugins"
import {
  type DataTag,
  type QueryClient,
  queryOptions
} from "@tanstack/react-query"
import type { APIError } from "better-auth"

import type { OrganizationAuthServer } from "../../../lib/auth-server"
import type {
  FullOrganizationData,
  FullOrganizationParams
} from "./full-organization-query"

export type ActiveOrganizationData<
  TAuth extends OrganizationAuthServer = OrganizationAuthServer
> = FullOrganizationData<TAuth>

export type ActiveOrganizationParams<
  TAuth extends OrganizationAuthServer = OrganizationAuthServer
> = Omit<FullOrganizationParams<TAuth>, "query"> & { query?: never }

/**
 * Query options factory for the active organization (same cache key as the
 * client-side `activeOrganizationOptions`, distinct from `fullOrganizationOptions`
 * when a `query` partition is used there).
 *
 * @param auth - The Better Auth server instance.
 * @param userId - The signed-in user's ID. Used for cache partitioning so
 *   the key matches the client-side `activeOrganizationOptions` for SSR hydration.
 * @param params - Parameters forwarded to `auth.api.getFullOrganization`.
 */
export function activeOrganizationOptions<TAuth extends OrganizationAuthServer>(
  auth: TAuth,
  userId: string,
  params: ActiveOrganizationParams<TAuth>
) {
  type TData = ActiveOrganizationData<TAuth>
  const queryKey = organizationQueryKeys.activeOrganization(userId)

  const options = queryOptions<TData, APIError, TData, typeof queryKey>({
    queryKey,
    queryFn: () =>
      auth.api.getFullOrganization(
        params as FullOrganizationParams<TAuth>
      ) as Promise<TData>
  })

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, APIError>
  }
}

export const ensureActiveOrganization = <TAuth extends OrganizationAuthServer>(
  queryClient: QueryClient,
  auth: TAuth,
  userId: string,
  params: ActiveOrganizationParams<TAuth>
) =>
  queryClient.ensureQueryData(activeOrganizationOptions(auth, userId, params))

export const prefetchActiveOrganization = <
  TAuth extends OrganizationAuthServer
>(
  queryClient: QueryClient,
  auth: TAuth,
  userId: string,
  params: ActiveOrganizationParams<TAuth>
) => queryClient.prefetchQuery(activeOrganizationOptions(auth, userId, params))

export const fetchActiveOrganization = <TAuth extends OrganizationAuthServer>(
  queryClient: QueryClient,
  auth: TAuth,
  userId: string,
  params: ActiveOrganizationParams<TAuth>
) => queryClient.fetchQuery(activeOrganizationOptions(auth, userId, params))
