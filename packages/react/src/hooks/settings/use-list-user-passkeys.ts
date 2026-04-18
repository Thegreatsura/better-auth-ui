import { skipToken, useQuery } from "@tanstack/react-query"
import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { listUserPasskeysOptions } from "../../queries/settings/list-user-passkeys-options"
import { useSession } from "../auth/use-session"

export type UseListUserPasskeysOptions = Omit<
  ReturnType<typeof listUserPasskeysOptions>,
  "queryKey" | "queryFn"
> &
  NonNullable<Parameters<AuthClient["passkey"]["listUserPasskeys"]>[0]>

/**
 * Retrieve the passkeys registered for the current user.
 *
 * Keyed per-user; waits for the active session before firing.
 *
 * @param options - Better Auth params (`fetchOptions`) and React Query
 *   options forwarded to `useQuery`.
 * @returns React Query result for the passkeys list.
 */
export function useListUserPasskeys(options?: UseListUserPasskeysOptions) {
  const { authClient } = useAuth()
  const { data: session } = useSession({ refetchOnMount: false })
  const userId = session?.user.id
  const disabled = !userId

  const { fetchOptions, ...queryOptions } = options ?? {}

  return useQuery({
    ...listUserPasskeysOptions(authClient, userId, { fetchOptions }),
    ...(disabled && { queryFn: skipToken }),
    ...queryOptions
  })
}
