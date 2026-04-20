import {
  type DataTag,
  type QueryClient,
  queryOptions
} from "@tanstack/react-query"
import type { Auth } from "better-auth"
import type { BetterFetchError } from "better-auth/react"

type AuthServer = Pick<Auth, "api">

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
  const queryKey = ["auth", "getSession", params?.query ?? null] as const

  const options = queryOptions<TData, BetterFetchError, TData, typeof queryKey>(
    {
      queryKey,
      queryFn: () => auth.api.getSession(params) as Promise<TData>
    }
  )

  return options as typeof options & {
    queryKey: DataTag<typeof queryKey, TData, BetterFetchError>
  }
}

export const ensureSession = <TAuth extends AuthServer>(
  auth: TAuth,
  queryClient: QueryClient,
  params: SessionParams<TAuth>
) => queryClient.ensureQueryData(sessionOptions(auth, params))
