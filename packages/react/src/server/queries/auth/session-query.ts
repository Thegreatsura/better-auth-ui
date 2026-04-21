import { authKeys } from "@better-auth-ui/core"
import {
  type DataTag,
  type QueryClient,
  queryOptions
} from "@tanstack/react-query"
import type { APIError } from "better-auth"

import type { AuthServer } from "../../../lib/auth-server"

type SessionData<TAuth extends AuthServer> = ReturnType<
  TAuth["api"]["getSession"]
>

type SessionParams<TAuth extends AuthServer> = Parameters<
  TAuth["api"]["getSession"]
>[0]

/**
 * Query options factory for the current session.
 *
 * @param authClient - The Better Auth client.
 * @param params - Parameters forwarded to `authClient.getSession`.
 */
export function sessionOptions<TAuth extends AuthServer>(
  auth: TAuth,
  params: SessionParams<TAuth>
) {
  type TData = SessionData<TAuth>
  const queryKey = authKeys.session(params?.query)

  const options = queryOptions<TData, APIError, TData, typeof queryKey>({
    queryKey,
    queryFn: () => auth.api.getSession(params) as Promise<TData>
  })

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, APIError>
  }
}

export const ensureSession = <TAuth extends AuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  params: SessionParams<TAuth>
) => queryClient.ensureQueryData(sessionOptions(auth, params))

export const prefetchSession = <TAuth extends AuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  params: SessionParams<TAuth>
) => queryClient.prefetchQuery(sessionOptions(auth, params))

export const fetchSession = <TAuth extends AuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  params: SessionParams<TAuth>
) => queryClient.fetchQuery(sessionOptions(auth, params))
