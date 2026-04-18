import { skipToken, useQuery } from "@tanstack/react-query"
import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { listUserPasskeysOptions } from "../../queries/list-user-passkeys-options"
import { useSession } from "../auth/use-session"

export type UseListUserPasskeysOptions = Omit<
  ReturnType<typeof listUserPasskeysOptions>,
  "queryKey" | "queryFn"
>

/**
 * Retrieve the passkeys registered for the current user.
 *
 * Keyed per-user; waits for the active session before firing.
 *
 * @param params - Parameters forwarded to `authClient.passkey.listUserPasskeys`.
 * @param options - React Query options forwarded to `useQuery`.
 * @returns React Query result for the passkeys list.
 */
export function useListUserPasskeys(
  params?: Parameters<AuthClient["passkey"]["listUserPasskeys"]>[0],
  options?: UseListUserPasskeysOptions
) {
  const { authClient } = useAuth()
  const { data: session } = useSession(undefined, { refetchOnMount: false })
  const userId = session?.user.id
  const disabled = !userId

  return useQuery({
    ...listUserPasskeysOptions(authClient, userId, params),
    ...(disabled && { queryFn: skipToken }),
    ...options
  })
}
